---
work_package_id: WP01
title: Ports and Results Foundations
lane: "done"
dependencies: []
base_branch: main
base_commit: ba38b704a04ddc2f288772a30986e47db232fc0e
created_at: '2026-03-12T13:39:46.674840+00:00'
subtasks: [T001, T002, T003, T004, T005]
requirement_refs: [FR-01, FR-02, FR-03]
shell_pid: "72848"
agent: "gemini-cli"
reviewed_by: "PavelPetrovich87"
review_status: "approved"
---

# Work Package: WP01 - Ports and Results Foundations

## Objective
Establish the structural foundations for the Pricing context by defining result types and inbound port interfaces (Application layer).

## Context
We are implementing the Pricing context's application layer. The result types for pricing currently reside in the Cart context's domain, which violates bounded context boundaries. We also need to define functional interfaces for the new use cases following the project's standalone function pattern.

## Technical Guidance

### Subtask T001: Move PricingResults.ts
**Purpose**: Align result types with the correct bounded context (Pricing).
**Steps**:
1. Copy `src/features/cart/domain/PricingResults.ts` to `src/features/pricing/domain/PricingResults.ts`.
2. Delete the original file `src/features/cart/domain/PricingResults.ts`.
3. Update all existing imports in the codebase that used the old path.
**Validation**:
- [ ] No compilation errors due to missing imports.
- [ ] `PricingResults` types (`CouponResult`, `MoneyResult`, etc.) are available in `src/features/pricing/domain/`.

### Subtask T002: Create IValidateCoupon.ts
**Purpose**: Define the inbound port for validating a coupon code.
**Steps**:
1. Create `src/features/pricing/application/ports/IValidateCoupon.ts`.
2. Define `ValidateCoupon` as a functional type: `(code: string) => Promise<CouponResult>`.
**Validation**:
- [ ] Functional type correctly imported from domain results.

### Subtask T003: Create ICalculateDiscount.ts
**Purpose**: Define the inbound port for calculating the discount amount.
**Steps**:
1. Create `src/features/pricing/application/ports/ICalculateDiscount.ts`.
2. Define `CalculateDiscount` as a functional type: `(code: string, subtotal: Money) => Promise<MoneyResult>`.
**Validation**:
- [ ] Functional type correctly imported from domain results and `Money` value object.

### Subtask T004: Update driven port IPricingService.ts
**Purpose**: Ensure the Cart context's driven port for Pricing uses the correct domain types.
**Steps**:
1. Update `src/features/cart/application/ports/IPricingService.ts` to import `CouponResult` and `MoneyResult` from the new `pricing` domain path.
**Validation**:
- [ ] `IPricingService` correctly compiles with new imports.

### Subtask T005: Create barrel file for ports
**Purpose**: Clean exports for the application ports.
**Steps**:
1. Create `src/features/pricing/application/ports/index.ts`.
2. Export all inbound ports.
**Validation**:
- [ ] Barrel file provides easy access to all functional types.

## Definition of Done
- Result types are moved to the pricing domain.
- Inbound ports are defined as functional types in the application layer.
- Driven ports in other contexts are updated to use the new imports.
- No compilation errors.

## Reviewer Guidance
Check for clean imports and correct alignment of types with context boundaries.

## Activity Log

- 2026-03-12T13:39:47Z – gemini-cli – shell_pid=71674 – lane=doing – Assigned agent via workflow command
- 2026-03-12T13:40:40Z – gemini-cli – shell_pid=71674 – lane=for_review – Ready for review: Pricing results moved and inbound ports defined.
- 2026-03-12T14:02:18Z – gemini-cli – shell_pid=72848 – lane=doing – Started review via workflow command
- 2026-03-12T14:06:30Z – gemini-cli – shell_pid=72848 – lane=done – Review passed: Pricing results moved to correct context and functional inbound ports defined as per DDD principles.
