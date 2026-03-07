---
work_package_id: WP02
title: Cart Logic & Domain Events
lane: "doing"
dependencies: [WP01]
base_branch: 004-cart-aggregate-root-WP01
base_commit: db95a7fee0fc4d1c639e33108387ab917ac4489b
created_at: '2026-03-07T13:29:23.160257+00:00'
subtasks:
- T006
- T007
- T008
- T009
- T010
- T011
phase: Phase 1 - Domain Logic
shell_pid: "57062"
history:
- timestamp: '2026-03-07T13:06:00Z'
  lane: planned
  agent: antigravity
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
requirement-refs: [FR-001, FR-002, FR-003, FR-004, FR-008, FR-009]
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-008
- FR-009
---

# Work Package Prompt: WP02 -- Cart Logic & Domain Events

## Objectives & Success Criteria

- Complete `Cart` aggregate logic: `addItem`, `removeItem`, `changeQuantity`.
- Real-time `subtotal` calculation.
- Integration with `EventBus` for domain events.
- Enforced state transitions for checkout flow.

## Context & Constraints

- Depends on `WP01` (Entities) and `T-002` (EventBus).
- Events must be published *after* state modification.

## Subtasks & Detailed Guidance

### Subtask T006 -- Implement `addItem` logic
- **Purpose**: Add or increment items.
- **Steps**: If `skuId` exists in map, increment quantity. Else add new `CartItem`.
- **Files**: `src/features/cart/domain/Cart.ts`

### Subtask T007 -- Implement `removeItem` and `changeQuantity`
- **Purpose**: Manage existing items.
- **Steps**:
  - `removeItem(skuId)`: delete from map.
  - `changeQuantity(skuId, qty)`: update existing, throw if qty < 1.
- **Files**: `src/features/cart/domain/Cart.ts`

### Subtask T008 -- Implement `subtotal` calculation
- **Purpose**: Aggregated total.
- **Steps**: Getter `subtotal` that sums `item.total()` for all items using `Money.add`.

### Subtask T009 -- Integrate `EventBus`
- **Purpose**: Decouple domain logic from side effects.
- **Steps**:
  - Inject `IEventBus` into `Cart` methods or use a domain event recording pattern.
  - Emit: `ItemAddedToCart`, `CartItemQuantityChanged`, `ItemRemovedFromCart`.

### Subtask T010 -- State Transitions
- **Purpose**: Guard checkout flow.
- **Steps**:
  - `initiateCheckout()`: transition to `Checkout_Pending` if `Active` and `items.size > 0`.
  - `markCheckedOut()`: transition to `Checked_Out` if `Checkout_Pending`.

### Subtask T011 -- Cart Unit Tests
- **Purpose**: Verify all logic.
- **Files**: `src/features/cart/domain/__tests__/Cart.spec.ts`

## Test Strategy

- `npx vitest src/features/cart/domain/__tests__/Cart.spec.ts`

## Activity Log

- 2026-03-07T13:06:00Z -- antigravity -- lane=planned -- Prompt created.
