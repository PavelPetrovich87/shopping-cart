---
work_package_id: WP01
title: Coupon Domain Entity & Zod Schema
lane: planned
dependencies: []
subtasks: [T001, T002, T003, T004]
requirement_refs:
- FR-1
- FR-4
- FR-5
requirements: [FR-1, FR-4, FR-5]
---

# Objective
Implement the core `Coupon` aggregate root using Zod for robust validation of domain invariants. This is the foundation of the Pricing & Promotions domain.

# Context
The project uses DDD and Hexagonal Architecture. The `Coupon` aggregate root must be a pure domain entity that ensures it can never be created in an invalid state. It must use the `Money` value object for all currency-related fields.

# Guidance

### T001: Define Coupon properties and discountType enum using Zod
- Create `src/features/pricing/domain/Coupon.ts`.
- Define `CouponType` enum (or Zod native enum) with values `FLAT` and `PERCENTAGE`.
- Create a `CouponSchema` using Zod that includes:
  - `code`: Non-empty alphanumeric string.
  - `discountType`: One of `CouponType`.
  - `discountValue`: Positive number (integer cents for `FLAT`, 1-100 for `PERCENTAGE`).
  - `status`: `ACTIVE` or `INACTIVE` (default `ACTIVE`).
  - `expirationDate`: Optional `Date`.

### T002: Implement Coupon class with static factory create method
- Define a `Coupon` class that implements the `CouponProps` derived from the Zod schema.
- Add a `static create(props: CouponProps): Coupon` method that parses props through `CouponSchema.parse(props)`.
- The constructor should be private to enforce use of the factory method.

### T003: Add internal validation logic for Active/Inactive and expirationDate
- Add a `validate(context: { currentDate: Date }): { isValid: boolean; error?: string }` method.
- Logic:
  - If `status === 'INACTIVE'`, return `{ isValid: false, error: 'Sorry, but this coupon is inactive' }`.
  - If `expirationDate` exists and `currentDate > expirationDate`, return `{ isValid: false, error: 'Sorry, but this coupon has expired' }`.
  - Otherwise, return `{ isValid: true }`.

### T004: Implement basic isValid() method
- Add a helper `isValid(currentDate: Date): boolean` that calls the internal validation logic.

# Files
- `src/features/pricing/domain/Coupon.ts` (new)
- `src/features/pricing/domain/__tests__/Coupon.spec.ts` (new)

# Definition of Done
- [ ] `Coupon` can be instantiated with valid data.
- [ ] `Coupon.create()` throws Zod error with invalid data (e.g., negative percentage).
- [ ] `validate()` correctly identifies inactive and expired coupons.
- [ ] Unit tests cover all schema invariants and validation states.

# Reviewer Guidance
- Ensure Zod schema is strictly defined and reflects the domain requirements.
- Verify the class is pure and does not leak infrastructure details.
- Check that the factory method is the only way to create instances.
