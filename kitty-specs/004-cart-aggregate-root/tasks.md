# Work Packages: T-004 Cart Aggregate Root & CartItem Entity

**Inputs**: Design documents from `/kitty-specs/004-cart-aggregate-root/`
**Prerequisites**: plan.md, spec.md, data-model.md

**Tests**: Unit tests for domain logic and state transitions are required.

**Organization**: Fine-grained subtasks (`Txxx`) roll up into work packages (`WPxx`).

---

## Work Package WP01: Core Domain Entities (Priority: P0) [FR-001, FR-004, FR-007]

**Goal**: Implement the foundational `CartItem` entity and the skeletal `Cart` aggregate root.
**Independent Test**: `CartItem` can be instantiated and its total calculated; `Cart` can be created with an empty item map.
**Requirements**: FR-001, FR-004, FR-007
**Prompt**: `/tasks/WP01-core-domain-entities.md`

### Included Subtasks
- [x] T001 Implement `CartItem` entity in `src/features/cart/domain/CartItem.ts` [FR-001]
- [x] T002 Implement `Cart` aggregate root skeleton in `src/features/cart/domain/Cart.ts` [FR-001]
- [x] T003 Define `CartState` enum in `src/features/cart/domain/CartState.ts` [FR-007]
- [x] T004 Add `Money` integration to `CartItem` for price tracking [FR-004]
- [x] T005 [P] Create initial unit tests for `CartItem` in `src/features/cart/domain/__tests__/CartItem.spec.ts` [FR-001]

### Implementation Notes
- Follow the DDD patterns established in Tier 1.
- Ensure `CartItem` quantity invariant (>= 1).

### Parallel Opportunities
- T005 can start as soon as T001 is drafted.

### Dependencies
- Depends on T-001 (Money VO).

### Risks & Mitigations
- Incomplete invariant enforcement; handled by early T005 tests.

---

## Work Package WP02: Cart Logic & Domain Events (Priority: P0) [FR-001, FR-002, FR-003, FR-004, FR-008, FR-009]

**Goal**: Implement full cart mutations, subtotal calculation, and domain event emission.
**Independent Test**: Adding/removing items correctly updates subtotal and emits expected events.
**Requirements**: FR-001, FR-002, FR-003, FR-004, FR-008, FR-009
**Prompt**: `/tasks/WP02-cart-logic-and-events.md`

### Included Subtasks
- [x] T006 Implement `addItem` logic in `Cart.ts` with incrementing support [FR-001]
- [x] T007 Implement `removeItem` and `changeQuantity` logic in `Cart.ts` [FR-002, FR-003]
- [x] T008 Implement `subtotal` calculation using `Money` [FR-004]
- [x] T009 Integrate `EventBus` to emit `ItemAddedToCart`, `CartItemQuantityChanged`, etc. [FR-001, FR-002, FR-003]
- [x] T010 Implement state transitions: `initiateCheckout` and `markCheckedOut` [FR-008, FR-009]
- [x] T011 [P] Comprehensive unit tests for `Cart` invariants and event emission in `src/features/cart/domain/__tests__/Cart.spec.ts` [FR-001, FR-002, FR-003, FR-008, FR-009]

### Implementation Notes
- Use the `shared/events` infrastructure for event emission.
- Ensure state transition guards are strictly enforced.

### Parallel Opportunities
- T011 can be developed iteratively alongside T006-T010.

### Dependencies
- Depends on WP01 and T-002 (EventBus).

---

## Work Package WP03: Coupon Integration & Refinement (Priority: P1) [FR-005, FR-006]

**Goal**: Add coupon support to the Cart and finalize domain logic.
**Independent Test**: Coupons can be applied and removed, affecting the cart state.
**Requirements**: FR-005, FR-006
**Prompt**: `/tasks/WP03-coupon-integration.md`

### Included Subtasks
- [ ] T012 Add `appliedCoupons` collection to `Cart` [FR-005]
- [ ] T013 Implement `applyCoupon` and `removeCoupon` methods [FR-005, FR-006]
- [ ] T014 Emit `CartCleared` event when all items are removed [FR-002]
- [ ] T015 [P] Add unit tests for coupon-related logic in `Cart.spec.ts` [FR-005, FR-006]

### Implementation Notes
- Coupon validation itself is T-010, this task only handles the Cart's receipt of coupons.

### Dependencies
- Depends on WP02.

---

## Dependency & Execution Summary

- **Sequence**: WP01 -> WP02 -> WP03.
- **Parallelization**: Limited within domain entities; tests can run in parallel with implementation.
- **MVP Scope**: WP01 and WP02 are required for the base Cart functionality.

---

## Subtask Index (Reference)

| Subtask ID | Summary | Work Package | Priority | Parallel? |
|------------|---------|--------------|----------|-----------|
| T001       | CartItem Entity | WP01         | P0       | No        |
| T002       | Cart Aggregate Root | WP01         | P0       | No        |
| T003       | CartState Enum | WP01         | P0       | Yes       |
| T004       | Money Integration | WP01         | P0       | No        |
| T005       | CartItem Tests | WP01         | P0       | Yes       |
| T006       | Add Item Logic | WP02         | P0       | No        |
| T007       | Remove/Change Qty | WP02         | P0       | No        |
| T008       | Subtotal Calc | WP02         | P0       | No        |
| T009       | Event Emission | WP02         | P0       | No        |
| T010       | State Transitions | WP02         | P0       | No        |
| T011       | Cart Logic Tests | WP02         | P0       | Yes       |
| T012       | Applied Coupons | WP03         | P1       | No        |
| T013       | Coupon Methods | WP03         | P1       | No        |
| T014       | CartCleared Event | WP03         | P1       | No        |
| T015       | Coupon Tests | WP03         | P1       | Yes       |
