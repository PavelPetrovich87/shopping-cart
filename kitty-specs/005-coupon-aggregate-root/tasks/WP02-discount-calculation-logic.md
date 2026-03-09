---
work_package_id: WP02
title: Discount Calculation Logic
lane: planned
dependencies: [WP01]
subtasks: [T005, T006, T007, T008]
requirement_refs:
- FR-2
- FR-3
requirements: [FR-2, FR-3]
---

# Objective
Implement the business logic for calculating discounts within the `Coupon` aggregate root, ensuring all calculations use the `Money` value object and never result in a negative order total.

# Context
Discounts can be either a flat amount or a percentage of the subtotal. The subtotal is passed as a `Money` instance. The result of the calculation must also be a `Money` instance.

# Guidance

### T005: Implement calculateDiscount(subtotal: Money) for FLAT type
- If `discountType === 'FLAT'`, return the `discountValue` wrapped as a `Money` object.
- The `discountValue` should be considered as integer cents.

### T006: Implement calculateDiscount(subtotal: Money) for PERCENTAGE type
- If `discountType === 'PERCENTAGE'`, calculate the discount amount based on the subtotal.
- Use `subtotal.multiply(discountValue / 100)` (assuming `Money` supports multiplication by a float or provides a percentage helper).
- Ensure the result is correctly rounded (integer cents).

### T007: Add logic to cap discounts at the subtotal (prevent negative totals)
- In the `calculateDiscount` method, check if the calculated discount amount is greater than the subtotal.
- If it is, return the subtotal as the discount amount instead. This ensures the total is exactly `$0.00`.

### T008: Ensure Money value object is correctly integrated for all calculations
- All arithmetic operations within `Coupon` should be performed using `Money` methods.
- Import `Money` from `src/shared/domain/Money.ts`.

# Files
- `src/features/pricing/domain/Coupon.ts` (modified)
- `src/features/pricing/domain/__tests__/Coupon.spec.ts` (modified)

# Definition of Done
- [ ] Flat discounts correctly calculated.
- [ ] Percentage discounts correctly calculated.
- [ ] Discounts are capped at the subtotal ($30 subtotal, $50 discount -> $30).
- [ ] Unit tests cover various subtotal values and edge cases (e.g., $0.00 subtotal).

# Reviewer Guidance
- Verify the math for percentage calculations handles edge cases (rounding).
- Ensure the subtotal cap is correctly implemented for both discount types.
- Check that `Money` instances are always used for financial amounts.
