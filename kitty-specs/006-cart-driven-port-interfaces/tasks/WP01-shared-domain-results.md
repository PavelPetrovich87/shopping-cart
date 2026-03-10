---
work_package_id: WP01
title: Shared Domain Results
lane: "planned"
dependencies: []
base_branch: main
base_commit: 4a9afa3bc08332cfb15d03bbbcf1e7db48493dbf
created_at: '2026-03-09T13:52:35.258352+00:00'
subtasks:
- T001
- T002
- T003
phase: Phase 1 - Foundational Domain
shell_pid: "41219"
agent: "antigravity"
review_status: "has_feedback"
reviewed_by: "PavelPetrovich87"
review_feedback_file: "/private/var/folders/zr/vdfx43852vd35jqx5vv0j0qh0000gn/T/spec-kitty-review-feedback-WP01.md"
history:
- timestamp: '2026-03-09T13:52:00Z'
  lane: planned
  agent: system
  action: Prompt generated via /spec-kitty.tasks
requirement_refs:
- FR-02
- FR-03
requirements:
- FR-02
- FR-03
---

# Work Package Prompt: WP01 -- Shared Domain Results

## Objectives & Success Criteria

- Implement a generic, type-safe `Result<T, E>` wrapper for functional error handling.
- Define feature-specific domain result types for the Cart context.
- Ensure all business-level "failures" (out of stock, invalid coupon) are represented as typed outcomes rather than exceptions.

## Context & Constraints

- Follow the implementation plan and design documents in `/kitty-specs/006-cart-driven-port-interfaces/`.
- `Money` value object from `@/shared/domain/Money` must be used for financial outcomes.
- Use a Discriminated Union pattern with `success` as the discriminant property.

## Subtasks & Detailed Guidance

### Subtask T001 -- Create `Result<T, E>` wrapper
- **Purpose**: Provide a reusable functional container for success/failure outcomes.
- **Steps**:
    - Create `src/shared/domain/Result.ts`.
    - Implement a Discriminated Union `type` or `interface`.
    - Recommended shape:
      ```typescript
      export type Result<T, E = string> = 
        | { success: true; value: T }
        | { success: false; error: E };
      ```
- **Files**: `src/shared/domain/Result.ts`

### Subtask T002 -- Create `StockResult`
- **Purpose**: Define valid outcomes for stock availability checks.
- **Steps**:
    - Create `src/features/cart/domain/StockResult.ts`.
    - Define a `StockResult` type that uses the `Result` wrapper.
    - Success data: `{ available: boolean, currentStock: number }`.
    - Error codes (union of string literals): `'INVALID_SKU' | 'OUT_OF_STOCK' | 'INSUFFICIENT_STOCK'`.
- **Files**: `src/features/cart/domain/StockResult.ts`

### Subtask T003 -- Create `PricingResults`
- **Purpose**: Define outcomes for coupon validation and discount calculation.
- **Steps**:
    - Create `src/features/cart/domain/PricingResults.ts`.
    - Define `CouponResult` (Success: `{ code: string, discount_amount?: Money, discount_percentage?: number }`, Errors: `'INVALID_CODE' | 'EXPIRED' | 'COUPON_NOT_FOUND'`).
    - Define `MoneyResult` (Success: `Money`, Errors: `'NEGATIVE_TOTAL' | 'CALCULATION_FAILURE'`).
- **Files**: `src/features/cart/domain/PricingResults.ts`

## Review Guidance

- Check that the `success` field is correctly used for type narrowing.
- Verify error codes match the `data-model.md` exactly.
- Ensure no runtime dependencies are added; keep it as pure TypeScript types/interfaces where possible.

## Review Feedback

**Reviewed by**: PavelPetrovich87
**Status**: ❌ Changes Requested
**Date**: 2026-03-10
**Feedback file**: `/private/var/folders/zr/vdfx43852vd35jqx5vv0j0qh0000gn/T/spec-kitty-review-feedback-WP01.md`

**Issue 1: Unrelated file modifications and deletions.**
You have modified or deleted many files that are completely outside the scope of your WP. For instance, you deleted the entire `src/features/inventory/domain/` and `src/features/pricing/domain/` folders, and you modified many files in `kitty-specs/` and `package-lock.json`. 

**How to fix:**
1. Please undo your commit softly, or checkout `main` versions for the unrelated files:
   `git checkout main -- src/features/inventory/ src/features/pricing/ kitty-specs/ .kittify/ TICKETS.md package-lock.json package.json`
2. Ensure you have NO deleted files or unrelated modifications staged. Your `git status` should only show your 3 created files.
3. Only keep and commit the 3 files you created:
   - `src/shared/domain/Result.ts`
   - `src/features/cart/domain/StockResult.ts`
   - `src/features/cart/domain/PricingResults.ts`
4. Re-commit (or `git commit --amend --no-edit` once the index is fixed).


## Activity Log

- 2026-03-09T13:52:00Z -- system -- lane=planned -- Prompt generated via /spec-kitty.tasks
- 2026-03-09T13:52:35Z – gemini-cli – shell_pid=17075 – lane=doing – Assigned agent via workflow command
- 2026-03-09T13:53:54Z – gemini-cli – shell_pid=17075 – lane=for_review – Implemented shared Result wrapper, StockResult, and PricingResults for the Cart domain.
- 2026-03-10T08:06:35Z – antigravity – shell_pid=41219 – lane=doing – Started review via workflow command
- 2026-03-10T08:10:48Z – antigravity – shell_pid=41219 – lane=planned – Moved to planned
