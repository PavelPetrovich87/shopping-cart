# Pricing & Promotions Bounded Context

> Auto-generated based on project README and DDD requirements
> Created: 2026-03-04
> Last Updated: 2026-03-04

## 1. Ubiquitous Language
- **Coupon:** A promotion code that grants a discount on the order total.
- **Validation:** The process of checking if a coupon code is existing and applicable.
- **Discount:** The amount subtracted from the subtotal based on coupon rules.

## 2. Aggregate Root
**Coupon**
- **Description:** Manages coupon codes, their specific validation rules, and rules for calculating order discounts.
- **Invariants:**
  - A coupon must have a unique identifier (code).
  - Validation must return specific domain errors for non-existent or invalid codes.
  - Discount calculations should never result in a negative order total.

## 3. Structural Elements
### Entities
- `Coupon` (Identifier: `code`): The main entity representing a promotion.

### Value Objects
- `Money`: Represents financial amounts avoiding floating-point precision issues.
- `DiscountAmount`: A value object representing the result of a discount calculation.

## 4. Lifecycle
- States: `Active` -> `Expired` / `Deactivated`
- Transitions:
  - Coupons are generally static in the context of a cart session but can be validated against expiration.

## 5. Ports (CQRS)
### Driving Ports (Inbound)
#### Commands (Mutations)
- `ValidateCoupon`: (Query-like but often acts as an entry point for validation logic) Checks if a code is valid.
#### Queries (Reads)
- `CalculateDiscount`: Calculates the discount amount based on a `couponCode` and `rawSubtotal`.
- `GetCouponDetails`: Retrieves the description and details of a specific coupon.

### Driven Ports (Outbound)
- `ICouponRepository`: Loads coupon data from the data source (mocked or persistent).

## 6. Domain Events
- `CouponValidated`: Triggered when a coupon successfully passes all rules.
- `CouponValidationFailed`: Triggered when an invalid code is provided.
- `DiscountCalculated`: Triggered after a discount is successfully applied to a subtotal.

## 7. Context Relationships
- **Cart Context:** Upstream - Consumes the `IPricingService` to validate coupons and calculate order totals.
