# Specification: Coupon Aggregate Root

**Status**: Draft
**Feature**: 005-coupon-aggregate-root
**Mission**: software-dev

## Goal
Implement the `Coupon` aggregate root within the Pricing domain to manage promotional codes and their associated discount logic. The aggregate will encapsulate its own validation rules, internal lifecycle (active/inactive/expired), and support both flat and percentage-based discount calculations.

## User Scenarios & Testing
- **Scenario: Flat Amount Discount**
  - Given a coupon for $5.00 off and a subtotal of $25.00, the calculated discount should be $5.00.
  - Verification: `coupon.calculateDiscount(Money.fromPrice(25)).format() === "$5.00"`
- **Scenario: Percentage Discount**
  - Given a coupon for 10% off and a subtotal of $100.00, the calculated discount should be $10.00.
  - Verification: `coupon.calculateDiscount(Money.fromPrice(100)).format() === "$10.00"`
- **Scenario: Maximum Discount Cap**
  - Given a coupon for $50.00 off and a subtotal of $30.00, the calculated discount should be capped at $30.00 (ensuring the total is $0.00).
  - Verification: `coupon.calculateDiscount(Money.fromPrice(30)).format() === "$30.00"`
- **Scenario: Expired Coupon Validation**
  - Given an expired coupon code, the validation should fail with an appropriate domain error.
  - Verification: `coupon.isValid()` should return `false` if current date > expiration date.

## Functional Requirements
- **FR-1: Unique Identifier**
  - Every coupon must have a unique identifier string (code).
- **FR-2: Discount Modes**
  - Must support two discount calculation modes:
    - **Flat Amount**: Subtracts a fixed `Money` value.
    - **Percentage**: Subtracts a percentage of the subtotal.
- **FR-3: Total Guard**
  - Calculating a discount must never result in a negative order total. The discount must be capped at the subtotal value.
- **FR-4: Internal Lifecycle Management**
  - The coupon aggregate root must manage its own state:
    - `Active`: Coupon is available for use.
    - `Inactive`: Coupon has been manually deactivated.
    - `Expired`: System current date exceeds the coupon's expiration date.
- **FR-5: Validation Logic**
  - Must provide a method to validate the coupon's current state against the provided context (e.g., current date).
- **FR-6: Domain Events**
  - Must emit domain events when key actions occur:
    - `CouponValidated`: Emitted when validation passes.
    - `CouponValidationFailed`: Emitted when validation fails.
    - `DiscountCalculated`: Emitted when a discount is successfully calculated.

## Success Criteria
- **SC-1**: Coupons correctly calculate both flat and percentage discounts based on subtotals.
- **SC-2**: Order totals never drop below $0.00, regardless of the discount amount or percentage.
- **SC-3**: Coupons automatically report as invalid if they are deactivated or past their expiration date.
- **SC-4**: Domain events are correctly triggered and contain the necessary context (e.g., discount amount, code).

## Key Entities
- **Coupon (Aggregate Root)**: The primary entity managing codes, rules, and lifecycle.
- **Money (Value Object)**: Used for all financial values and calculations.

## Assumptions
- The current system time is used for expiration checks.
- A coupon can only have one type of discount (either flat or percentage, not both simultaneously).
- Deactivation is a manual status change handled within the aggregate.
