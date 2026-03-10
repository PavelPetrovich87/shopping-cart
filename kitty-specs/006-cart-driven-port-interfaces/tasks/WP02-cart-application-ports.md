---
work_package_id: WP02
title: Cart Application Ports
lane: "for_review"
dependencies: [WP01]
base_branch: 006-cart-driven-port-interfaces-WP01
base_commit: fbbee41e35a176368a6871d59f1add5bd3642b49
created_at: '2026-03-09T13:55:08.787588+00:00'
subtasks:
- T004
- T005
- T006
phase: Phase 2 - Interface Contracts
shell_pid: "44496"
agent: "gemini-cli"
review_status: "has_feedback"
reviewed_by: "PavelPetrovich87"
review_feedback_file: "/private/var/folders/zr/vdfx43852vd35jqx5vv0j0qh0000gn/T/spec-kitty-review-feedback-WP02.md"
history:
- timestamp: '2026-03-09T13:54:00Z'
  lane: planned
  agent: system
  action: Prompt generated via /spec-kitty.tasks
requirement_refs:
- FR-01
- FR-02
- FR-03
- FR-04
requirements:
- FR-01
- FR-02
- FR-03
- FR-04
---

# Work Package Prompt: WP02 -- Cart Application Ports

## Objectives & Success Criteria

- Define the driven port interfaces for the Cart context in the application layer.
- Enforce Hexagonal Architecture by using domain-level contracts that driven adapters must fulfill.
- Ensure all port method signatures follow the requirements for ID-based lookup, synchronous execution for repositories, and asynchronous execution for services.

## Context & Constraints

- Follow the implementation plan and design documents in `/kitty-specs/006-cart-driven-port-interfaces/`.
- Refer to `contracts/*.md` for the exact method signatures and return types.
- Ensure all business types (`Cart`, `Money`, `StockResult`, `CouponResult`, `MoneyResult`) are imported from their respective domain locations.
- Repositories should have synchronous signatures to match the project's local state management (Zustand).

## Subtasks & Detailed Guidance

### Subtask T004 -- Create `ICartRepository` port
- **Purpose**: Contract for Cart persistence.
- **Steps**:
    - Create `src/features/cart/application/ports/ICartRepository.ts`.
    - Define an `interface` with `getCart(id: string): Cart` and `saveCart(cart: Cart): void`.
- **Files**: `src/features/cart/application/ports/ICartRepository.ts`

### Subtask T005 -- Create `IInventoryService` port
- **Purpose**: Contract for checking stock availability.
- **Steps**:
    - Create `src/features/cart/application/ports/IInventoryService.ts`.
    - Define an `interface` with `checkStockAvailability(skuId: string, quantity: number): Promise<StockResult>`.
- **Files**: `src/features/cart/application/ports/IInventoryService.ts`

### Subtask T006 -- Create `IPricingService` port
- **Purpose**: Contract for coupon validation and discount calculation.
- **Steps**:
    - Create `src/features/cart/application/ports/IPricingService.ts`.
    - Define an `interface` with `validateCoupon(code: string): Promise<CouponResult>` and `calculateDiscount(code: string, subtotal: Money): Promise<MoneyResult>`.
- **Files**: `src/features/cart/application/ports/IPricingService.ts`

## Review Guidance

- Verify that `ICartRepository` methods are synchronous and accept a Cart ID.
- Verify that `IInventoryService` and `IPricingService` methods return `Promise<Result<...>>`.
- Ensure no infrastructure-level types (e.g., HTTP responses, database models) leak into these interfaces.

## Review Feedback

**Reviewed by**: PavelPetrovich87
**Status**: ❌ Changes Requested
**Date**: 2026-03-10
**Feedback file**: `/private/var/folders/zr/vdfx43852vd35jqx5vv0j0qh0000gn/T/spec-kitty-review-feedback-WP02.md`

**Issue 1: Unresolved Dependency and Required Rebase**
Your dependency (WP01) has been rejected and sent back to `planned` because it inadvertently deleted several unrelated files across the project. 

**How to fix:**
1. Please wait for the agent assigned to WP01 to fix and merge their work.
2. Once WP01 is successfully merged to `main`, you MUST rebase your branch onto `main` to remove the incorrect file deletions from your history.
   Run: `git fetch origin main && git rebase origin/main` (or just `git rebase main` if you have it locally)
3. After rebasing and verifying your ports code is correct, you can transition back to for_review.


## Activity Log

- 2026-03-09T13:54:00Z -- system -- lane=planned -- Prompt generated via /spec-kitty.tasks
- 2026-03-09T13:55:09Z – gemini-cli – shell_pid=18013 – lane=doing – Assigned agent via workflow command
- 2026-03-09T13:55:44Z – gemini-cli – shell_pid=18013 – lane=for_review – Implemented driven port interfaces (ICartRepository, IInventoryService, IPricingService) in the application layer.
- 2026-03-10T08:11:05Z – antigravity – shell_pid=41219 – lane=doing – Started review via workflow command
- 2026-03-10T08:14:40Z – antigravity – shell_pid=41219 – lane=planned – Moved to planned
- 2026-03-10T08:43:43Z – gemini-cli – shell_pid=44496 – lane=doing – Started implementation via workflow command
- 2026-03-10T08:44:27Z – gemini-cli – shell_pid=44496 – lane=for_review – FIXED: Rebased onto cleaned WP01 branch and removed all accidental deletions/modifications.
