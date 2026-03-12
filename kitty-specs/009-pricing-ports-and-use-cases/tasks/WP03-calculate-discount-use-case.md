---
work_package_id: "WP03"
title: "Calculate Discount Use Case"
lane: "done"
dependencies: ["WP01"]
requirement_refs: ["FR-03"]
subtasks: ["T009", "T010", "T011"]
---

# Work Package: WP03 - Calculate Discount Use Case

## Objective
Implement the `CalculateDiscount` use case logic and its automated unit tests.

## Context
The `CalculateDiscount` use case handles the arithmetic of applying a coupon to a cart subtotal. It coordinates with the `ICouponRepository` and the `Coupon` aggregate to ensure calculations follow domain rules, specifically preventing negative order totals and handling both flat and percentage-based discounts.

## Technical Guidance

### Subtask T009: Implement CalculateDiscount function
**Purpose**: Core implementation of the discount calculation logic.
**Steps**:
1. Create `src/features/pricing/application/use-cases/CalculateDiscount.ts`.
2. Export a factory `createCalculateDiscount(repository: ICouponRepository): CalculateDiscount`.
3. Implement the logic:
   - Retrieve the `Coupon` using the repository.
   - If not found (potentially deleted between steps) → return failure or appropriate `MoneyResult` error.
   - Delegate the math to the aggregate's `calculateDiscount(subtotal)` method.
   - Return the calculated `Money` object in a success result.
**Validation**:
- [ ] Returns correct `MoneyResult` for success and failure cases.

### Subtask T010: Unit tests for CalculateDiscount
**Purpose**: Verify the calculation logic for various coupon and subtotal combinations.
**Steps**:
1. Create `src/features/pricing/application/use-cases/__tests__/CalculateDiscount.spec.ts`.
2. Mock `ICouponRepository` and provide mock `Coupon` instances for testing.
3. Test a flat discount (e.g., $10 off).
4. Test a percentage discount (e.g., 20% off).
5. Test a case where the discount exceeds the subtotal (ensure it's capped).
6. Test a case where the subtotal is zero.
**Validation**:
- [ ] All tests pass.
- [ ] Correct `Money` objects returned with accurate raw cents values.

### Subtask T011: Discount event validation
**Purpose**: Ensure the discount process generates correct domain events.
**Steps**:
1. In the unit tests, verify that `Coupon.calculateDiscount()` is called and the `DiscountCalculated` event is returned.
2. Check that the event's metadata correctly reflects the coupon code, subtotal, and final discount.
**Validation**:
- [ ] `DiscountCalculated` event is correctly populated.

## Definition of Done
- `CalculateDiscount` implementation complete.
- Unit tests for FLAT and PERCENTAGE discounts.
- Caps discount at subtotal to prevent negative totals.

## Reviewer Guidance
Check that calculations correctly handle integer cents to avoid floating-point issues (using the `Money` value object).
Confirm that the capping logic is correctly implemented.
