# Implementation Tickets — Shopping Cart Interface

> Tickets are ordered by **tier** (dependency order). A ticket can only start after all its `Depends On` items are complete. All tickets within the same tier can be executed **in parallel**.

---

## Tier 1 — Base Foundation
*Independent tasks that form the base of the application.*

### T-001: Shared `Money` Value Object ✅
| Field | Value |
|---|---|
| **Context** | `shared` |
| **Complexity** | 🟢 Small |
| **Depends On** | — |

**Description**: Implement `src/shared/domain/Money.ts` — an immutable Value Object that wraps financial amounts as integers (cents) to avoid floating-point issues. Must support `add`, `subtract`, `multiply`, `equals`, and `format` (locale-aware currency string).

**Acceptance Criteria**:
- [x] All arithmetic uses integer cents internally
- [x] `Money.fromPrice(25)` → stores `2500` cents
- [x] `money.format()` → `"$25.00"`
- [x] Immutable — all operations return new `Money` instances
- [x] Unit tests cover arithmetic, formatting, and edge cases (zero, negative guard)

---

### T-002: Async Domain Event Bus ✅
| Field | Value |
|---|---|
| **Context** | `shared` |
| **Complexity** | 🟡 Medium |
| **Depends On** | — |

**Description**: Implement `src/shared/events/EventBus.ts` — a typed, async Pub/Sub event bus. Handlers subscribe by event type and are invoked asynchronously when events are published. Must support multiple handlers per event and provide an `unsubscribe` mechanism.

**Acceptance Criteria**:
- [x] `eventBus.subscribe<ItemAddedToCart>(handler)` registers a typed handler
- [x] `eventBus.publish(event)` invokes all matching handlers asynchronously
- [x] Multiple handlers per event type supported
- [x] `unsubscribe` returns a teardown function
- [x] Unit tests cover: subscribe, multi-handler dispatch, unsubscribe, async execution order

---

### T-003: Shared Fixtures from `data/` ✅
| Field | Value |
|---|---|
| **Context** | `shared` |
| **Complexity** | 🟢 Small |
| **Depends On** | — |

**Description**: Create `src/shared/fixtures/` by importing and re-exporting typed data from the existing `data/` folder (`products.json`, `inventory.json`, `coupons.json`, `sample-cart.json`, `product-images.json`). Provide TypeScript types for each JSON shape.

**Acceptance Criteria**:
- [x] Each JSON file has a corresponding TypeScript interface (e.g., `InventoryRecord`, `CouponRecord`)
- [x] Data is importable via `import { inventoryData } from '@/shared/fixtures'`
- [x] Types match the actual JSON shape (validated by TS compiler, no `any`)

---

## Tier 2 — Domain Entities
*Core business logic depending only on Tier 1.*

### T-004: Cart Aggregate Root & `CartItem` Entity ✅
| Field | Value |
|---|---|
| **Context** | 🛍️ Cart |
| **Complexity** | 🟡 Medium |
| **Depends On** | T-001 |

**Description**: Implement `Cart.ts` (Aggregate Root) and `CartItem.ts` (Entity). The Cart manages an internal collection of `CartItem`s keyed by `skuId`. Enforce invariants: quantity ≥ 1, multiple coupons allowed. Cart has lifecycle states: `Active` → `Checkout_Pending` → `Checked_Out`. Subtotal is computed from `CartItem` prices using `Money`.

**Acceptance Criteria**:
- [x] `cart.addItem(item)` adds or increments quantity
- [x] `cart.removeItem(skuId)` removes an item
- [x] `cart.changeQuantity(skuId, qty)` enforces qty ≥ 1
- [x] `cart.subtotal` returns a `Money` value
- [x] State transitions: `initiateCheckout()` → `Checkout_Pending`, `markCheckedOut()` → `Checked_Out`
- [x] Domain events emitted: `ItemAddedToCart`, `CartItemQuantityChanged`, `ItemRemovedFromCart`, `CartCleared`
- [x] Unit tests for all invariants and state transitions

---

### T-007: `ProductVariant` Aggregate Root
| Field | Value |
|---|---|
| **Context** | 📦 Inventory |
| **Complexity** | 🟡 Medium |
| **Depends On** | T-001 |

**Description**: Implement `ProductVariant.ts` and `StockReservation.ts` (Value Object). `ProductVariant` holds `totalOnHand`, `sold`, pricing info, and a collection of `StockReservation`s. Available stock = `totalOnHand - sumReserved`. Enforce `totalOnHand ≥ 0`.

**Acceptance Criteria**:
- [ ] `variant.availableStock` computes correctly
- [ ] `variant.reserve(orderId, qty)` creates a `StockReservation`
- [ ] `variant.releaseReservation(orderId)` removes it
- [ ] `variant.confirmDepletion(orderId)` reduces `totalOnHand` and removes reservation
- [ ] Domain events: `StockReserved`, `StockDepleted`
- [ ] Unit tests for stock math and reservation lifecycle

---

### T-009: `Coupon` Aggregate Root
| Field | Value |
|---|---|
| **Context** | 🎟️ Pricing |
| **Complexity** | 🟡 Medium |
| **Depends On** | T-001 |

**Description**: Implement `Coupon.ts` aggregate. Coupons have a `code`, optional `discount_amount` (flat `Money`), and optional `discount_percentage`. Supports two discount modes: flat amount or percentage. Calculating discount against a subtotal must never result in negative totals.

**Acceptance Criteria**:
- [ ] `coupon.calculateDiscount(subtotal: Money): Money` works for flat and percentage modes
- [ ] Percentage mode: `$100 subtotal × 10% → $10 discount`
- [ ] Flat mode: `$5 off`
- [ ] 100% discount caps at subtotal (total ≥ $0.00)
- [ ] Domain events: `CouponValidated`, `CouponValidationFailed`, `DiscountCalculated`
- [ ] Unit tests for both modes + edge cases

---

## Tier 3 — Ports & Basic Use Cases
*Interfaces and early orchestration depending on entities from Tier 2.*

### T-005: Cart Ports (Interfaces)
| Field | Value |
|---|---|
| **Context** | 🛍️ Cart |
| **Complexity** | 🟢 Small |
| **Depends On** | T-004 |

**Description**: Define port interfaces in `src/features/cart/application/ports/`: `ICartRepository`, `IInventoryService`, `IPricingService`. These are the contracts that driven adapters must fulfill.

**Acceptance Criteria**:
- [ ] `ICartRepository`: `getCart()`, `saveCart(cart)` method signatures
- [ ] `IInventoryService`: `checkStockAvailability(skuId, quantity): Promise<StockResult>`
- [ ] `IPricingService`: `validateCoupon(code): Promise<CouponResult>`, `calculateDiscount(code, subtotal): Promise<Money>`
- [ ] All return types are domain types (no infrastructure leaks)

---

### T-008: Inventory Ports & Use Cases
| Field | Value |
|---|---|
| **Context** | 📦 Inventory |
| **Complexity** | 🟡 Medium |
| **Depends On** | T-007 |

**Description**: Define `IStockRepository` port and implement use cases: `CheckStockAvailability`, `ReserveStock`, `ReleaseStockReservation`, `ConfirmStockDepletion`.

**Acceptance Criteria**:
- [ ] `CheckStockAvailability(skuId, qty)` returns `{ available: boolean, currentStock: number }`
- [ ] `ReserveStock` creates reservations and emits `StockReserved`
- [ ] `ReleaseStockReservation` cleans up expired holds
- [ ] Unit tests with mocked repository

---

### T-010: Pricing Ports & Use Cases
| Field | Value |
|---|---|
| **Context** | 🎟️ Pricing |
| **Complexity** | 🟢 Small |
| **Depends On** | T-009 |

**Description**: Define `ICouponRepository` port. Implement `ValidateCoupon` and `CalculateDiscount` use cases.

**Acceptance Criteria**:
- [ ] `ValidateCoupon(code)` returns success or specific domain error (`"Please enter a valid code"`, `"Sorry, but this coupon doesn't exist"`)
- [ ] `CalculateDiscount(code, subtotal)` returns the discount `Money`
- [ ] Unit tests with mock repo

---

## Tier 4 — Core Logic & Adapters
*Cart use cases and data storage relying on lower tiers.*

### T-006: Cart Use Cases
| Field | Value |
|---|---|
| **Context** | 🛍️ Cart |
| **Complexity** | 🔴 Large |
| **Depends On** | T-004, T-005, T-002 |

**Description**: Implement all Cart use cases in `src/features/cart/application/use-cases/`: `AddItemToCart`, `RemoveItemFromCart`, `ChangeCartItemQuantity`, `ApplyCouponToCart`, `RemoveCouponFromCart`, `InitiateCheckout`. Each use case orchestrates domain logic, validates via driven ports, and publishes domain events.

**Acceptance Criteria**:
- [ ] `AddItemToCart` checks stock via `IInventoryService` before adding
- [ ] `ChangeCartItemQuantity` checks stock before updating
- [ ] `ApplyCouponToCart` validates via `IPricingService`
- [ ] `InitiateCheckout` validates all items' stock, transitions state, emits `CheckoutInitiated`
- [ ] All use cases publish appropriate domain events via EventBus
- [ ] Unit tests with mocked ports for each use case (happy + error paths)

---

### T-011: Zustand Cart Repository + Context Adapters
| Field | Value |
|---|---|
| **Context** | 🛍️ Cart |
| **Complexity** | 🟡 Medium |
| **Depends On** | T-005, T-008, T-010 |

**Description**: Implement `ZustandCartRepository` (implements `ICartRepository`), `InventoryContextAdapter` (implements `IInventoryService` by calling Inventory use cases), and `PricingContextAdapter` (implements `IPricingService` by calling Pricing use cases). Wire everything so the Cart context can query stock and coupons through its ports.

**Acceptance Criteria**:
- [ ] `ZustandCartRepository.getCart()` returns reactive Cart state
- [ ] `InventoryContextAdapter.checkStockAvailability()` delegates to Inventory use case
- [ ] `PricingContextAdapter.validateCoupon()` delegates to Pricing use case
- [ ] Integration tests verifying the full port → adapter → use case chain

---

### T-012: Mock Inventory & Coupon Repositories
| Field | Value |
|---|---|
| **Context** | 📦 Inventory + 🎟️ Pricing |
| **Complexity** | 🟢 Small |
| **Depends On** | T-003, T-008, T-010 |

**Description**: Implement `MockInventoryRepository` (loads from `shared/fixtures/inventory`) and `MockCouponRepository` (loads from `shared/fixtures/coupons`). These are the in-memory driven adapters that will later be swapped for real API calls.

**Acceptance Criteria**:
- [ ] Repositories load data from shared fixtures at initialization
- [ ] `MockInventoryRepository.findBySku(skuId)` returns a `ProductVariant`
- [ ] `MockCouponRepository.findByCode(code)` returns a `Coupon` or `null`
- [ ] Designed behind the port interface — swapping to `AxiosInventoryRepository` later requires zero domain changes

---

## Tier 5 — UI Components
*Presentation layer depending on core logic.*

### T-013: Cart Page & Cart Row Components
| Field | Value |
|---|---|
| **Context** | 🛍️ Cart UI |
| **Complexity** | 🔴 Large |
| **Depends On** | T-006, T-011 |

**Description**: Build `CartPage`, `CartRow`, `EmptyState`, and `QuantitySelector` React components. Cart renders items sorted by `created_at` (latest first). Each row shows variant image, name, pricing (strikethrough list price if discounted), quantity selector, and remove link. Responsive: two-column on desktop, stacked on mobile.

**Acceptance Criteria**:
- [ ] Empty cart → `EmptyState` component rendered
- [ ] Cart items sorted latest-first by `created_at`
- [ ] Variant image + name are clickable (link to product detail)
- [ ] Discount pricing: sale price shown, list price struck through
- [ ] `QuantitySelector`: "−" disabled at qty=1, "+" disabled at max stock with tooltip
- [ ] "Remove" link triggers confirmation prompt
- [ ] Responsive layout: columns on desktop, stacked on mobile
- [ ] Component tests for each state

---

### T-014: Order Summary & Coupon Input Components
| Field | Value |
|---|---|
| **Context** | 🛍️ Cart UI |
| **Complexity** | 🔴 Large |
| **Depends On** | T-006, T-011 |

**Description**: Build `OrderSummary` and `CouponInput` components. Order summary shows subtotal, applied discounts, shipping (FREE), and total — all recalculating in real time. Coupon input has button → input transition, Apply button, validation states (empty error, invalid error, success tag), and remove ("x") on applied coupons.

**Acceptance Criteria**:
- [ ] Subtotal, shipping, total update in real time on every cart mutation
- [ ] "Add coupon code" button transitions to input field on click
- [ ] Input states: normal, filled, focus, disabled, error, error-filled, error-focused
- [ ] Empty submit → "Please enter a valid code" error
- [ ] Invalid code → "Sorry, but this coupon doesn't exist" error
- [ ] Valid code → success tag shown, discount line added to summary
- [ ] "x" on tag removes coupon and recalculates
- [ ] Component tests for all states and interactions

---

## Tier 6 — Apex Checkout Integration
*The peak of the implementation depending on everything below it.*

### T-015: Checkout Flow & Stock Reservation
| Field | Value |
|---|---|
| **Context** | Cross-context |
| **Complexity** | 🔴 Large |
| **Depends On** | T-006, T-008, T-011, T-013, T-014 |

**Description**: Wire the end-to-end checkout flow. "Checkout" button triggers `InitiateCheckoutUseCase` which validates all items' stock, emits `CheckoutInitiated`, and Inventory subscribes to reserve stock. If stock has changed since cart was loaded, show modal with updated quantities and let user confirm. Includes stock reservation with timeout (stretch).

**Acceptance Criteria**:
- [ ] Clicking "Checkout" validates all cart items' stock availability
- [ ] If stock changed → modal shown with updated info, cart updated on "Ok"
- [ ] `CheckoutInitiated` event triggers `ReserveStock` in Inventory context (via EventBus)
- [ ] Reserved stock reduces available count for other users
- [ ] Reservation timeout releases stock (stretch: timer-driven `ReleaseStockReservation`)
- [ ] Cart transitions to `Checked_Out` state on success
- [ ] Integration test covering the full event chain

---

## Summary Matrix

| Tier | Tickets | Effort |
|---|---|---|
| **Tier 1 — Base Foundation** | T-001, T-002, T-003 | 🟢🟢🟡 |
| **Tier 2 — Domain Entities** | T-004, T-007, T-009 | 🟡🟡🟡 |
| **Tier 3 — Ports & Basic UC** | T-005, T-008, T-010 | 🟢🟡🟢 |
| **Tier 4 — Logic & Adapters** | T-006, T-011, T-012 | 🔴🟡🟢 |
| **Tier 5 — UI Components** | T-013, T-014 | 🔴🔴 |
| **Tier 6 — Apex** | T-015 | 🔴 |
| **Total** | **15 tickets** | |

### Dependency Pyramid 

```mermaid
graph BT
    %% Styling
    classDef t1 fill:#e2f0d9,stroke:#385723,stroke-width:2px;
    classDef t2 fill:#fff2cc,stroke:#d6b656,stroke-width:2px;
    classDef t3 fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px;
    classDef t4 fill:#f8cecc,stroke:#b85450,stroke-width:2px;
    classDef t5 fill:#e1d5e7,stroke:#9673a6,stroke-width:2px;
    classDef t6 fill:#ffe6cc,stroke:#d79b00,stroke-width:2px;

    %% Nodes
    T001("T-001: Money VO"):::t1
    T002("T-002: EventBus"):::t1
    T003("T-003: Fixtures"):::t1

    T004("T-004: Cart Aggregate"):::t2
    T007("T-007: ProductVariant"):::t2
    T009("T-009: Coupon Aggregate"):::t2

    T005("T-005: Cart Ports"):::t3
    T008("T-008: Inventory UC"):::t3
    T010("T-010: Pricing UC"):::t3

    T006("T-006: Cart Use Cases"):::t4
    T011("T-011: Context Adapters"):::t4
    T012("T-012: Mock Repos"):::t4

    T013("T-013: Cart UI"):::t5
    T014("T-014: Order Summary UI"):::t5

    T015("T-015: Checkout Flow"):::t6

    %% Edges (Dependencies)
    T004 -.-> T001
    T007 -.-> T001
    T009 -.-> T001

    T005 --> T004
    T008 --> T007
    T010 --> T009

    T006 --> T004 & T005 & T002
    T011 --> T005 & T008 & T010
    T012 --> T003 & T008 & T010

    T013 --> T006 & T011
    T014 --> T006 & T011

    T015 --> T006 & T008 & T011 & T013 & T014
```
