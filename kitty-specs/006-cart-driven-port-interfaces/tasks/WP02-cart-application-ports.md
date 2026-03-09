---
work_package_id: WP02
title: Cart Application Ports
lane: planned
dependencies: [WP01]
subtasks:
- T004
- T005
- T006
phase: Phase 2 - Interface Contracts
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

## Activity Log

- 2026-03-09T13:54:00Z -- system -- lane=planned -- Prompt generated via /spec-kitty.tasks
