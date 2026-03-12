---
work_package_id: WP03
title: Checkout Lifecycle
lane: "doing"
dependencies: [WP01]
base_branch: 010-cart-use-cases-WP01
base_commit: 57d9ffe3d7dd70db9988e899d3c2197889742bd4
created_at: '2026-03-12T14:35:33.930171+00:00'
subtasks: [T007, T010]
requirement_refs: [FR-006]
shell_pid: "79287"
---

# WP03: Checkout Lifecycle

Implement the `InitiateCheckout` use case with comprehensive inventory checks across all cart items.

## Objective
Ensure the cart transitions to `Checkout_Pending` only if every item in the cart is currently available in the requested quantity.

## Context
- **Feature**: 010-cart-use-cases
- **Dependencies**: `IInventoryService` (Driven Port)
- **Source**: `src/features/cart/application/use-cases/`
- **Tests**: `tests/unit/features/cart/application/use-cases/CheckoutUseCase.spec.ts`

## Detailed Guidance

### T007: Implement `InitiateCheckout` use case
- **Purpose**: Validate all items and lock the cart state for checkout.
- **File**: `src/features/cart/application/use-cases/InitiateCheckout.ts`
- **Steps**:
  1. Define handler: `async (params: { cartId: string }, deps: CartUseCaseDependencies): Promise<UseCaseResult>`.
  2. Fetch cart.
  3. Iterate over all items in the cart aggregate.
  4. For each item, call `inventoryService.checkStockAvailability(item.skuId, item.quantity)`.
  5. If ANY stock check fails, return `Result.fail('STOCK_UNAVAILABLE')` with the failing SKU information if possible.
  6. Call `cart.initiateCheckout()`.
  7. Return `Result.ok({ updatedCart: cart, events: cart.pullEvents() })`.
- **Validation**:
  - [ ] Returns `STOCK_UNAVAILABLE` if even one item is out of stock.
  - [ ] Transitions the cart aggregate state correctly.
  - [ ] Records `CheckoutInitiated` event.

### T010: Create unit tests for `InitiateCheckout`
- **Purpose**: Verify state transitions and bulk inventory checks.
- **File**: `tests/unit/features/cart/application/use-cases/CheckoutUseCase.spec.ts`
- **Tests**:
  - [ ] Happy path with 100% stock availability.
  - [ ] Failure path if one item is out of stock.
  - [ ] Failure path for an empty cart (should be handled by aggregate).
  - [ ] Failure path if cart is not in `Active` state.
- **Validation**:
  - [ ] All tests pass using `vitest`.

## Definition of Done
- `InitiateCheckout` handler implemented with bulk stock validation.
- All errors (empty cart, out of stock) handled via `Result.fail`.
- 100% test coverage for this handler.

## Next Step
`spec-kitty implement WP03 --base WP01`
