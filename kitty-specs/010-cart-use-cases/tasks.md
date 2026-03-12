# Tasks: Cart Use Cases Implementation
*Path: kitty-specs/010-cart-use-cases/tasks.md*

## Master Subtask List

| ID | Task | Prereq | Parallel? |
|---|---|---|---|
| T001 | Add missing domain events (`CouponAppliedToCart`, `CouponRemovedFromCart`, `CheckoutInitiated`) | - | Yes |
| T002 | Implement `AddItemToCart` use case | T001 | Yes |
| T003 | Implement `RemoveItemFromCart` use case | T001 | Yes |
| T004 | Implement `ChangeCartItemQuantity` use case | T001 | Yes |
| T005 | Implement `ApplyCouponToCart` use case | T001 | Yes |
| T006 | Implement `RemoveCouponFromCart` use case | T001 | Yes |
| T007 | Implement `InitiateCheckout` use case | T001 | Yes |
| T008 | Create unit tests for Item use cases (`AddItemToCart`, `RemoveItemFromCart`, `ChangeCartItemQuantity`) | T002, T003, T004 | Yes |
| T009 | Create unit tests for Coupon use cases (`ApplyCouponToCart`, `RemoveCouponFromCart`) | T005, T006 | Yes |
| T010 | Create unit tests for `InitiateCheckout` use case | T007 | Yes |

---

## Work Packages

### WP01: Cart Item Management
- **Goal**: Implement foundation events and the three core item mutation use cases.
- **Priority**: High
- **Requirements**: FR-001, FR-002, FR-003
- **Test Criteria**: All item use cases pass unit tests with 100% coverage, including stock check failures.
- **Included Subtasks**:
  - [x] T001: Add missing domain events
  - [x] T002: Implement `AddItemToCart` use case
  - [x] T003: Implement `RemoveItemFromCart` use case
  - [x] T004: Implement `ChangeCartItemQuantity` use case
  - [x] T008: Create unit tests for Item use cases
- **Implementation Sketch**:
  1. Update `CartEvents.ts` with new interfaces.
  2. Implement functional handlers in `src/features/cart/application/use-cases/`.
  3. Orchestrate `IInventoryService` for stock checks.
  4. Ensure `Result` pattern is used for errors (e.g., `OUT_OF_STOCK`).
  5. Return modified aggregate and pulled events.
- **Prompt**: `tasks/WP01-cart-item-management.md` (~450 lines)

### WP02: Coupon and Pricing
- **Goal**: Implement coupon application and removal use cases.
- **Priority**: Medium
- **Requirements**: FR-004, FR-005
- **Test Criteria**: Coupons are validated via `IPricingService` and applied/removed correctly.
- **Included Subtasks**:
  - [x] T005: Implement `ApplyCouponToCart` use case
  - [x] T006: Implement `RemoveCouponFromCart` use case
  - [x] T009: Create unit tests for Coupon use cases
- **Implementation Sketch**:
  1. Implement `ApplyCouponToCart` calling `pricingService.validateCoupon`.
  2. Implement `RemoveCouponFromCart`.
  3. Ensure `Result` pattern handles `INVALID_COUPON` errors.
- **Dependencies**: WP01 (for events)
- **Prompt**: `tasks/WP02-coupon-and-pricing.md` (~350 lines)

### WP03: Checkout Lifecycle
- **Goal**: Implement the `InitiateCheckout` use case with full stock validation.
- **Priority**: Medium
- **Requirements**: FR-006
- **Test Criteria**: Checkout transitions state to `Checkout_Pending` only if ALL items are in stock.
- **Included Subtasks**:
  - [ ] T007: Implement `InitiateCheckout` use case
  - [ ] T010: Create unit tests for `InitiateCheckout`
- **Implementation Sketch**:
  1. Iterate over all cart items and call `inventoryService.checkStockAvailability`.
  2. If any fail, return combined error.
  3. Transition `Cart` state and return events.
- **Dependencies**: WP01 (for events)
- **Prompt**: `tasks/WP03-checkout-lifecycle.md` (~300 lines)
