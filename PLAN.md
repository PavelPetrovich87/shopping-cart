# Implementation Plan: Shopping Cart Interface

**Branch**: `001-shopping-cart-interface` | **Date**: 2026-03-04 | **Spec**: [`README.md`](file:///d:/work/shopping-cart/README.md)
**Input**: Feature specification from `README.md` + Domain contexts from `.kittify/memory/domains/`

---

## Summary

Build a fully functional, responsive shopping cart UI using Domain-Driven Design (DDD) with Hexagonal Architecture. Three bounded contexts — **Cart**, **Inventory**, and **Pricing & Promotions** — are already defined and must remain the source of truth for all implementation decisions. The tech stack is React + TypeScript (Vite) with Zustand as the state management / repository layer.

---

## Technical Context

| Item | Value |
|---|---|
| **Language / Version** | TypeScript 5.x |
| **Framework** | React 18 (Vite) |
| **State / Repository** | Zustand (acts as the Driven Adapter / in-memory repository) |
| **Styling** | Vanilla CSS (responsive, mobile-first) |
| **Testing** | Vitest + React Testing Library |
| **Target Platform** | Web – Chrome, Firefox, Safari |
| **Performance Goals** | Real-time cart recalculation on every mutation; no perceptible lag |
| **Constraints** | **No backend for now**; all data mocked via in-memory repositories. Architecture must allow for easy replacement with real API adapters later. |
| **Scale / Scope** | Single-page cart + order summary; 3 bounded contexts |

---

## Constitution Check

> **Gate: Must pass before Phase 0 research. Re-check after Phase 1 design.**

| Rule | Status | Notes |
|---|---|---|
| DDD & Hexagonal Architecture strictly followed | ✅ Pass | Three BCs defined; ports/adapters pattern drives structure |
| No architecture creation without explicit user command | ✅ Pass | This plan is for review; no code generated yet |
| Discussion before specification | ✅ Pass | README + domain memory files consulted |
| Domain memory loaded before planning | ✅ Pass | `Cart.md`, `Inventory.md`, and `Pricing.md` now loaded |
| AI acts as consultant, not implementer (until commanded) | ✅ Pass | — |

> [!TIP]
> To ensure "easy to implement a backend later," we strictly enforce the **Repository Pattern** and **Driven Adapters**. The Application layer will only know about Port interfaces; the transition to a real backend will involve only writing new Infrastructure adapters (e.g., `AxiosCartRepository`) without touching Domain or Application logic.


---

## Project Structure

### Documentation (this feature)

```
kitty-specs/001-shopping-cart-interface/
├── plan.md              ← This file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/           ← Phase 1 output (TypeScript interfaces / port contracts)
└── tasks.md             ← Phase 2 output (/spec-kitty.tasks)
```

### Source Code (hexagonal, feature-first)

```
src/
  features/
    cart/                        ← 🛍️ Cart Context
      ui/                        ← [Driving Adapters] React components
        CartPage.tsx
        CartRow.tsx
        EmptyState.tsx
        QuantitySelector.tsx
      application/
        use-cases/
          AddItemToCart.ts
          RemoveItemFromCart.ts
          ChangeCartItemQuantity.ts
          ApplyCouponToCart.ts
          RemoveCouponFromCart.ts
          InitiateCheckout.ts
        ports/
          ICartRepository.ts
          IInventoryService.ts     ← Driven port → Inventory context
          IPricingService.ts       ← Driven port → Pricing context
      domain/
        Cart.ts                   ← Aggregate Root
        CartItem.ts               ← Entity
        Money.ts                  ← Value Object
        CartEvents.ts
      infrastructure/
        adapters/
          InventoryContextAdapter.ts
          PricingContextAdapter.ts
        repositories/
          ZustandCartRepository.ts

    inventory/                     ← 📦 Inventory Context
      application/
        use-cases/
          CheckStockAvailability.ts
          ReserveStock.ts
          ReleaseStockReservation.ts
          ConfirmStockDepletion.ts
        ports/
          IStockRepository.ts
      domain/
        ProductVariant.ts          ← Aggregate Root
        StockReservation.ts        ← Value Object
      infrastructure/
        repositories/
          MockInventoryRepository.ts

    pricing/                       ← 🎟️ Pricing & Promotions Context
      application/
        use-cases/
          ValidateCoupon.ts
          CalculateDiscount.ts
        ports/
          ICouponRepository.ts
      domain/
        Coupon.ts                  ← Aggregate Root
        Money.ts                   ← Shared Value Object (or import from shared/)
      infrastructure/
        repositories/
          MockCouponRepository.ts

  shared/
    domain/
      Money.ts                     ← Shared Value Object (if cross-context)
    events/
      EventBus.ts                  ← In-memory domain event bus
```

**Structure Decision**: Feature-first hexagonal layout. Each bounded context owns its full vertical slice (ui / application / domain / infrastructure). Shared primitives (`Money`, `EventBus`) live in `src/shared/` to avoid duplication.

---

## Domain Context Summary (from `.kittify/memory/domains/`)

### 🛍️ Cart Context ([`Cart.md`](file:///d:/work/shopping-cart/.kittify/memory/domains/Cart.md))

| Element | Detail |
|---|---|
| Aggregate Root | `Cart` |
| Key Invariants | Quantity ≥ 1; Quantity ≤ stock; Multiple coupons allowed |
| Key Entities | `CartItem` (ID: `skuId`) |
| Value Objects | `Money` |
| Lifecycle | `Active` → `Checkout_Pending` → `Checked_Out` |
| Driven Ports | `IInventoryService`, `IPricingService` |
| Domain Events | `ItemAddedToCart`, `CartItemQuantityChanged`, `ItemRemovedFromCart`, `CouponApplied`, `CouponRemoved`, `CartCleared`, `CheckoutInitiated`, `CartCheckedOut` |

### 📦 Inventory Context ([`Inventory.md`](file:///d:/work/shopping-cart/.kittify/memory/domains/Inventory.md))

| Element | Detail |
|---|---|
| Aggregate Root | `ProductVariant` (ID: `skuId`) |
| Key Invariants | `TotalOnHand` ≥ 0; must emit events on stock change |
| Value Objects | `StockReservation` (orderId, quantity, reservedAtTimestamp) |
| Lifecycle | Derived: `Available = TotalOnHand − Reserved` |
| Driven Ports | None (source of truth) |
| Domain Events | `StockReserved`, `StockDepleted` |

### 🎟️ Pricing & Promotions Context ([`Pricing.md`](file:///d:/work/shopping-cart/.kittify/memory/domains/Pricing.md))

| Element | Detail |
|---|---|
| Aggregate Root | `Coupon` |
| Key Invariants | Validates code existence; returns specific domain errors; discount cannot result in negative total |
| Driven Ports | `ICouponRepository` |
| Use Cases | `ValidateCoupon`, `CalculateDiscount` |

---

## Parallel Work Analysis

### Dependency Graph

```
Wave 0 — Foundation (must be sequential)
  └─ shared/Money.ts, shared/EventBus.ts
       └─ domain models: Cart, CartItem, ProductVariant, Coupon

Wave 1 — Context Cores (can be parallel after Wave 0)
  ├─ Cart domain + ports + use-cases
  ├─ Inventory domain + ports + use-cases
  └─ Pricing domain + ports + use-cases

Wave 2 — Infrastructure (can be parallel after Wave 1)
  ├─ ZustandCartRepository
  ├─ MockInventoryRepository
  ├─ MockCouponRepository
  └─ InventoryContextAdapter, PricingContextAdapter (wire ports)

Wave 3 — UI (after Wave 2)
  ├─ CartPage, CartRow, EmptyState
  ├─ QuantitySelector (stock-aware)
  └─ OrderSummary, CouponInput

Wave 4 — Integration & Checkout
  └─ CheckoutInitiated event → Inventory reservation flow
```

### Work Distribution

| Stream | Responsibility | Blocks |
|---|---|---|
| **Domain Foundation** | `Money`, `EventBus`, base aggregate types | Everything |
| **Cart Stream** | Cart aggregate + use cases + Zustand repo | Wave 3 UI |
| **Inventory Stream** | ProductVariant + stock queries + mock repo | Cart adapter |
| **Pricing Stream** | Coupon + discount calc + mock repo | Cart adapter |
| **UI Stream** | React components | Wave 2 complete |

### Coordination Points

- **Wave 0 → Wave 1**: Shared domain primitives merged and stable before BC work starts
- **Wave 1 → Wave 2**: Port interfaces (`IInventoryService`, `IPricingService`) agreed before adapters are written
- **Wave 2 → Wave 3**: Adapters wired and smoke-tested before UI consumes them
- **Integration test**: Checkout flow end-to-end test verifying `CheckoutInitiated` triggers `StockReserved`

---

## Resolved Decisions

| # | Decision | Resolution |
|---|---|---|
| 1 | **`Money` placement** | **Shared** — `src/shared/domain/Money.ts`. Pragmatic approach for now. |
| 2 | **EventBus pattern** | **Proper async pattern** — Pub/Sub with typed event handlers, async dispatch. |
| 3 | **Mock data format** | **Shared `src/shared/fixtures/` directory** seeded from existing `data/` folder (`coupons.json`, `inventory.json`, `products.json`, `sample-cart.json`, etc.). |
| 4 | **Stock reservation (stretch)** | **In scope — Wave 4.** Implemented as part of the Integration & Checkout wave. |
| 5 | **Backend** | **No backend for now.** Architecture uses Repository ports so real API adapters can be swapped in later without touching Domain/Application layers. |


---

## Verification Plan

### Automated Tests

```bash
# Run all unit tests
npx vitest run

# Run with coverage
npx vitest run --coverage
```

| Layer | Test Type | Focus |
|---|---|---|
| Domain | Unit | Invariant enforcement (Cart, ProductVariant) |
| Use Cases | Unit | Command/Query logic with mock ports |
| Adapters | Integration | Port ↔ Zustand/Mock wiring |
| UI | Component | CartRow, QuantitySelector, CouponInput states |
| E2E (manual) | Browser | Full checkout flow, stock modal, coupon happy/error paths |

### Manual Verification

- [ ] Cart renders correctly on mobile / tablet / desktop (match provided designs)
- [ ] Quantity selector: min=1 enforced, max=stock enforced with tooltip
- [ ] Coupon: empty → error; invalid code → error; valid → discount shown
- [ ] Remove item: confirmation prompt displayed before deletion
- [ ] Checkout: stock re-validated; modal shown if stock changed
- [ ] Real-time recalculation: subtotal + total update on every mutation
- [ ] Cross-browser: Chrome, Firefox, Safari
