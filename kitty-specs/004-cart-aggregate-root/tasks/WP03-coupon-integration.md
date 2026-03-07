---
work_package_id: WP03
title: Coupon Integration
lane: "for_review"
dependencies: [WP02]
base_branch: 004-cart-aggregate-root-WP02
base_commit: a77b51f99ce6274531e0f244d3ca9bcc8069da78
created_at: '2026-03-07T13:39:05.457412+00:00'
subtasks:
- T012
- T013
- T014
- T015
phase: Phase 1 - Domain Logic
shell_pid: "57062"
agent: "antigravity"
history:
- timestamp: '2026-03-07T13:07:00Z'
  lane: planned
  agent: antigravity
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
requirement-refs: [FR-005, FR-006]
requirement_refs:
- FR-005
- FR-006
---

# Work Package Prompt: WP03 -- Coupon Integration

## Objectives & Success Criteria

- Cart supports multiple applied coupons.
- Correct emission of `CartCleared`.
- Full coverage for coupon-related mutations.

## Subtasks & Detailed Guidance

### Subtask T012 -- Add `appliedCoupons` collection
- **Steps**: Add `string[]` to `Cart` to store validated coupon codes.

### Subtask T013 -- Implement `applyCoupon` and `removeCoupon`
- **Steps**: Methods to add/remove strings from the collection. No validation logic here (handled by use cases in T-006).

### Subtask T014 -- Emit `CartCleared` event
- **Steps**: When the last item is removed, emit `CartCleared`.

### Subtask T015 -- Coupon Unit Tests
- **Steps**: Update `Cart.spec.ts` to cover coupon additions and cart clearing.

## Activity Log

- 2026-03-07T13:07:00Z -- antigravity -- lane=planned -- Prompt created.
- 2026-03-07T13:39:05Z – antigravity – shell_pid=57062 – lane=doing – Assigned agent via workflow command
- 2026-03-07T13:40:44Z – antigravity – shell_pid=57062 – lane=for_review – Coupon integration and refined cart cleared event implemented and tested.
