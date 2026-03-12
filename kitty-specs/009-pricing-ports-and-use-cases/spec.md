# Feature Specification: Pricing Ports and Use Cases

## 1. Introduction
**Purpose**: The purpose of this feature is to establish the application layer use cases and driven port interfaces for the Pricing context. It enables the cart and checkout flows to validate user-provided coupon codes and calculate the resulting monetary discounts without leaking infrastructure details into the domain.

**Business Value**: By cleanly separating the pricing rules and coupon validation from the external data stores, the system can reliably offer promotional discounts to users. It enforces domain rules around coupon validity and discount amounts in a unified, testable manner, supporting future promotional complexity.

## 2. Actors & Assumptions
- **Actors**: 
  - **Shopper (End User)**: Inputs coupon codes during the checkout or cart viewing process.
  - **System/Cart Context**: Calls the pricing use cases through internal context adapters to validate codes and apply discounts to order subtotals.
- **Assumptions**: 
  - The `Coupon` aggregate root (T-009) and the `Money` value object (T-001) are fully implemented and available.
  - The persistence strategy (database, external API, or mock data) for coupons will be implemented separately by adapters; this specification only defines the port interface.
  - The application uses integer cents for all money calculations as defined by the `Money` value object.

## 3. User Scenarios & Testing

### Scenario 1: Applying a valid coupon code
- **Given** a shopper has items in their cart with a subtotal greater than zero.
- **When** the shopper enters a valid, existing coupon code.
- **Then** the system should report the coupon is valid and return the calculated discount amount, ensuring the discount does not cause the cart total to become negative.

### Scenario 2: Applying an empty or malformed coupon code
- **Given** a shopper attempts to apply a coupon.
- **When** the shopper enters an empty string or a grossly malformed code.
- **Then** the system should reject the code with the specific error: "Please enter a valid code".

### Scenario 3: Applying a non-existent coupon code
- **Given** a shopper attempts to apply a coupon.
- **When** the shopper enters a cleanly formatted code that does not exist in the system.
- **Then** the system should reject the code with the specific error: "Sorry, but this coupon doesn't exist".

## 4. Functional Requirements

### FR-01: Coupon Repository Port (`ICouponRepository`)
- The system must define an interface for retrieving coupons by their code. It should return a `Coupon` aggregate or a null/undefined indicator if not found.

### FR-02: Validate Coupon Use Case (`ValidateCoupon`)
- Must accept a coupon code string.
- If the string is empty or invalid superficially, it must return a failure result with the message: "Please enter a valid code".
- If the code attempts retrieval but is not found in the repository, it must return a failure result with the message: "Sorry, but this coupon doesn't exist".
- If the code is found and valid, it must return a success result (extensible for future structured return data).

### FR-03: Calculate Discount Use Case (`CalculateDiscount`)
- Must accept a coupon code and a subtotal (`Money` object).
- Must retrieve the coupon via the port.
- Must delegate the math to the `Coupon` aggregate root's `calculateDiscount` method.
- Must return the calculated discount as a `Money` object.
- Must handle cases where the code might not exist during calculation (e.g., deleted between validation and calculation).

## 5. Success Criteria
- The Pricing Application use cases can execute validation and calculation without direct dependencies on external databases or APIs.
- 100% of defined `ValidateCoupon` outcomes map to the exact stipulated domain error messages or success.
- The `CalculateDiscount` use case correctly outputs `Money` objects for both flat and percentage-based discounts.
- The architecture supports future expansion of validation errors (e.g., "expired") without breaking the interface signatures.

## 6. Key Entities / Data
- **Coupon**: The domain aggregate root containing discount amounts/percentages and validation rules.
- **Money**: The value object used for the subtotal input and discount output.
- **ICouponRepository**: The abstract port interface representing the boundary to external data.
