---
work_package_id: WP02
title: Coupon and Pricing
lane: "for_review"
dependencies: [WP01]
base_branch: 010-cart-use-cases-WP01
base_commit: 037f6a8bd7890f267a2da54533fbe9b12b9fba8e
created_at: '2026-03-12T14:31:07.168211+00:00'
subtasks: [T005, T006, T009]
requirement_refs: [FR-004, FR-005]
shell_pid: "77644"
agent: "gemini-cli"
---

# WP02: Coupon and Pricing

Implement coupon application and removal use cases using `IPricingService` for validation.

## Objective
Enable shoppers to apply and remove promotional coupon codes with external validation of rules (expiration, subtotal, etc.).

## Context
- **Feature**: 010-cart-use-cases
- **Dependencies**: `IPricingService` (Driven Port)
- **Source**: `src/features/cart/application/use-cases/`
- **Tests**: `tests/unit/features/cart/application/use-cases/CouponUseCases.spec.ts`

## Detailed Guidance

### T005: Implement `ApplyCouponToCart` use case
- **Purpose**: Validate and apply a coupon to the cart.
- **File**: `src/features/cart/application/use-cases/ApplyCouponToCart.ts`
- **Steps**:
  1. Define handler: `async (params: { cartId: string; code: string }, deps: CartUseCaseDependencies): Promise<UseCaseResult>`.
  2. Fetch cart.
  3. Call `pricingService.validateCoupon(params.code)`.
  4. If `CouponResult` fails, return `Result.fail(couponResult.error)`.
  5. Call `cart.applyCoupon(params.code)`.
  6. Return `Result.ok({ updatedCart: cart, events: cart.pullEvents() })`.
- **Validation**:
  - [ ] Passes external validation errors (e.g., `INVALID_CODE`, `EXPIRED`) to the result.
  - [ ] Only applies to the aggregate if validation succeeds.

### T006: Implement `RemoveCouponFromCart` use case
- **Purpose**: Remove an applied coupon.
- **File**: `src/features/cart/application/use-cases/RemoveCouponFromCart.ts`
- **Steps**:
  1. Fetch cart.
  2. Call `cart.removeCoupon(params.code)`.
  3. Return `Result.ok({ updatedCart: cart, events: cart.pullEvents() })`.
- **Validation**:
  - [ ] Silently succeeds even if coupon was not applied.

### T009: Create unit tests for Coupon use cases
- **Purpose**: Verify coupon logic and error handling.
- **File**: `tests/unit/features/cart/application/use-cases/CouponUseCases.spec.ts`
- **Tests**:
  - [ ] `ApplyCouponToCart` succeeds for valid code.
  - [ ] `ApplyCouponToCart` returns error for invalid code from `IPricingService`.
  - [ ] `RemoveCouponFromCart` removes coupon and updates timestamp.
- **Validation**:
  - [ ] All tests pass using `vitest`.

## Definition of Done
- `ApplyCouponToCart`, `RemoveCouponFromCart` handlers implemented.
- `IPricingService` correctly orchestrated for validation.
- 100% test coverage for these handlers.

## Next Step
`spec-kitty implement WP02 --base WP01`

## Activity Log

- 2026-03-12T14:31:07Z – gemini-cli – shell_pid=77644 – lane=doing – Assigned agent via workflow command
- 2026-03-12T14:32:15Z – gemini-cli – shell_pid=77644 – lane=for_review – Implemented ApplyCouponToCart and RemoveCouponFromCart use cases with validation via IPricingService.
