---
work_package_id: WP01
title: Shared Domain Results
lane: planned
dependencies: []
subtasks:
- T001
- T002
- T003
phase: Phase 1 - Foundational Domain
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

## Activity Log

- 2026-03-09T13:52:00Z -- system -- lane=planned -- Prompt generated via /spec-kitty.tasks
