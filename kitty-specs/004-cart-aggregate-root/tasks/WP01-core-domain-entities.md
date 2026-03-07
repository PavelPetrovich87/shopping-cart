---
work_package_id: WP01
title: Core Domain Entities
lane: "for_review"
dependencies: []
base_branch: main
base_commit: 28e408f446bd3ff67d793a9365ea42c8fce917dc
created_at: '2026-03-07T13:21:27.277032+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
phase: Phase 1 - Domain Logic
shell_pid: "57062"
agent: "antigravity"
history:
- timestamp: '2026-03-07T13:05:00Z'
  lane: planned
  agent: antigravity
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
requirement-refs: [FR-001, FR-004, FR-007]
requirement_refs:
- FR-001
- FR-004
- FR-007
---

# Work Package Prompt: WP01 -- Core Domain Entities

## [WARNING]️ IMPORTANT: Review Feedback Status

**Read this first if you are implementing this task!**

- **Has review feedback?**: Check the `review_status` field above.
- **Mark as acknowledged**: Update `review_status: acknowledged` in the frontmatter when starting.

---

## Objectives & Success Criteria

- Implement `CartItem` entity with quantity ≥ 1 invariant.
- Implement `Cart` aggregate root skeleton (items map, ID, state).
- Ensure `Money` integration for price at addition.
- 100% unit test coverage for `CartItem`.

## Context & Constraints

- Reference: `kitty-specs/004-cart-aggregate-root/data-model.md`
- Uses `src/shared/domain/Money.ts` (T-001).
- Follow Hexagonal/DDD patterns (entities in `domain/`).

## Subtasks & Detailed Guidance

### Subtask T001 -- Implement `CartItem` entity
- **Purpose**: Represents a product variant in the cart.
- **Steps**:
  1. Create `src/features/cart/domain/CartItem.ts`.
  2. Attributes: `skuId` (string), `quantity` (number), `priceAtAddition` (Money).
  3. Invariant: Throw error if `quantity < 1`.
  4. Method: `total()` returns `priceAtAddition.multiply(quantity)`.
- **Files**: `src/features/cart/domain/CartItem.ts`

### Subtask T002 -- Implement `Cart` aggregate root skeleton
- **Purpose**: Container for the shopping session.
- **Steps**:
  1. Create `src/features/cart/domain/Cart.ts`.
  2. Attributes: `id` (UUID), `items` (Map<string, CartItem>), `state` (CartState).
  3. Constructor initializes empty items map and `Active` state.
- **Files**: `src/features/cart/domain/Cart.ts`

### Subtask T003 -- Define `CartState` enum
- **Purpose**: Track cart lifecycle.
- **Steps**:
  1. Create `src/features/cart/domain/CartState.ts`.
  2. Values: `Active`, `Checkout_Pending`, `Checked_Out`.
- **Files**: `src/features/cart/domain/CartState.ts`

### Subtask T004 -- Money Integration
- **Purpose**: Ensure financial accuracy using the shared `Money` VO.
- **Steps**: Import `Money` from `@/shared/domain/Money` and use it for `priceAtAddition`.

### Subtask T005 -- CartItem Unit Tests
- **Purpose**: Verify invariants and calculations.
- **Steps**:
  1. Create `src/features/cart/domain/__tests__/CartItem.spec.ts`.
  2. Test cases: valid creation, invalid quantity (<1), total calculation.
- **Parallel?**: Yes.

## Test Strategy

- Run `npm test` or `vitest` (verify existing test runner in `package.json`).
- Command: `npx vitest src/features/cart/domain/__tests__/CartItem.spec.ts`

## Risks & Mitigations

- `Money` API mismatch: Review `src/shared/domain/Money.ts` first.

## Activity Log

- 2026-03-07T13:05:00Z -- antigravity -- lane=planned -- Prompt created.
- 2026-03-07T13:21:27Z – antigravity – shell_pid=57062 – lane=doing – Assigned agent via workflow command
- 2026-03-07T13:23:39Z – antigravity – shell_pid=57062 – lane=for_review – Implementation of core entities complete and tested.
