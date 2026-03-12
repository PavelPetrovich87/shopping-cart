---
work_package_id: WP01
title: Cart Item Management
lane: "doing"
dependencies: []
base_branch: main
base_commit: ef1aee36f9171361d54510cdaf0e967d17d17f6e
created_at: '2026-03-12T14:19:01.990082+00:00'
subtasks: [T001, T002, T003, T004, T008]
requirement_refs: [FR-001, FR-002, FR-003]
shell_pid: "74599"
agent: "gemini-cli"
---

# WP01: Cart Item Management

Implement foundational domain events and the three core item mutation use cases: `AddItemToCart`, `RemoveItemFromCart`, and `ChangeCartItemQuantity`.

## Objective
Create standalone functional handlers that orchestrate `Cart` domain logic and `IInventoryService` stock checks while remaining pure by returning the updated state and events.

## Context
- **Feature**: 010-cart-use-cases
- **Patterns**: Standalone functional handlers, Result pattern (`Result<T, E>`), Hexagonal Architecture.
- **Source**: `src/features/cart/application/use-cases/`
- **Tests**: `tests/unit/features/cart/application/use-cases/ItemUseCases.spec.ts`

## Detailed Guidance

### T001: Add missing domain events
- **Purpose**: Ensure the Event Bus can handle new cart lifecycle events.
- **File**: `src/features/cart/domain/CartEvents.ts`
- **Steps**:
  1. Add `CouponAppliedToCart` interface: `{ cartId: string; code: string; discountAmount?: Money; discountPercentage?: number; }`.
  2. Add `CouponRemovedFromCart` interface: `{ cartId: string; code: string; }`.
  3. Add `CheckoutInitiated` interface: `{ cartId: string; items: { skuId: string; quantity: number }[]; subtotal: Money; }`.
- **Validation**:
  - [ ] Types are correctly exported and inherit from `DomainEvent`.

### T002: Implement `AddItemToCart` use case
- **Purpose**: Safely add items to the cart after verifying stock availability.
- **File**: `src/features/cart/application/use-cases/AddItemToCart.ts`
- **Steps**:
  1. Define handler: `async (params: AddItemParams, deps: CartUseCaseDependencies): Promise<UseCaseResult>`.
  2. Fetch cart from `cartRepository.findById(params.cartId)`.
  3. Call `inventoryService.checkStockAvailability(params.skuId, params.quantity)`.
  4. If `StockResult` fails or `available === false`, return `Result.fail('OUT_OF_STOCK')`.
  5. Call `cart.addItem(...)` on the aggregate.
  6. Return `Result.ok({ updatedCart: cart, events: cart.pullEvents() })`.
- **Validation**:
  - [ ] Returns `OUT_OF_STOCK` error if stock check fails.
  - [ ] Returns modified cart and events on success.

### T003: Implement `RemoveItemFromCart` use case
- **Purpose**: Remove an item from the cart.
- **File**: `src/features/cart/application/use-cases/RemoveItemFromCart.ts`
- **Steps**:
  1. Fetch cart from repository.
  2. Call `cart.removeItem(params.skuId)`.
  3. Return `Result.ok({ updatedCart: cart, events: cart.pullEvents() })`.
- **Validation**:
  - [ ] Silently succeeds even if item doesn't exist (per `Cart` domain implementation).

### T004: Implement `ChangeCartItemQuantity` use case
- **Purpose**: Update the quantity of an existing item after verifying stock.
- **File**: `src/features/cart/application/use-cases/ChangeCartItemQuantity.ts`
- **Steps**:
  1. Fetch cart from repository.
  2. Call `inventoryService.checkStockAvailability(params.skuId, params.newQuantity)`.
  3. If stock check fails, return `Result.fail('OUT_OF_STOCK')`.
  4. Call `cart.changeQuantity(params.skuId, params.newQuantity)`.
  5. Return `Result.ok({ updatedCart: cart, events: cart.pullEvents() })`.
- **Validation**:
  - [ ] Errors if item not in cart.
  - [ ] Errors if stock insufficient for the *entire* new quantity.

### T008: Create unit tests for Item use cases
- **Purpose**: Verify 100% coverage of the above use cases.
- **File**: `tests/unit/features/cart/application/use-cases/ItemUseCases.spec.ts`
- **Tests**:
  - [ ] `AddItemToCart` happy path with mocked inventory.
  - [ ] `AddItemToCart` failure path when stock is unavailable.
  - [ ] `RemoveItemFromCart` removes item and emits `ItemRemovedFromCart`.
  - [ ] `ChangeCartItemQuantity` updates quantity and emits `CartItemQuantityChanged`.
- **Validation**:
  - [ ] All tests pass using `vitest`.

## Definition of Done
- Missing events added to `CartEvents.ts`.
- `AddItemToCart`, `RemoveItemFromCart`, `ChangeCartItemQuantity` implemented as functional handlers.
- All errors handled via `Result.fail`.
- 100% test coverage for these handlers.

## Next Step
`spec-kitty implement WP01`

## Activity Log

- 2026-03-12T14:19:02Z – gemini-cli – shell_pid=74599 – lane=doing – Assigned agent via workflow command
