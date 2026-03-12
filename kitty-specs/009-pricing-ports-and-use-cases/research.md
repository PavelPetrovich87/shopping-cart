# Research: 009-pricing-ports-and-use-cases

## Goal
Establish the pattern for standalone function use cases with Pure Dependency Injection (DI) and tiered validation.

## Findings

### 1. Standalone Function Use Cases
- **Decision**: Implement each use case as a function that returns its implementation (closure) or directly receives dependencies as arguments.
- **Pattern**:
  ```typescript
  // Inbound Port
  export type ValidateCoupon = (code: string) => Promise<CouponResult>;

  // Implementation (Higher Order Function for DI)
  export const createValidateCoupon = (repository: ICouponRepository): ValidateCoupon => {
    return async (code: string) => {
      // Logic
    };
  };
  ```
- **Rationale**: Clean, testable, and follows functional principles without the overhead of class-based DI frameworks.

### 2. Pure Dependency Injection (Manual DI)
- **Decision**: Manage dependencies at a central Composition Root.
- **Implementation**: Create a `src/main.ts` or dedicated context provider that instantiates repositories and passes them to the use case factories.
- **Rationale**: Keeps the application layer pure and decoupled from infrastructure details.

### 3. Tiered Validation Strategy
- **Layer 1 (UI)**: Basic format checks (e.g., non-empty string).
- **Layer 2 (Use Case)**: Presence checks and workflow-specific validation (e.g., "Sorry, but this coupon doesn't exist").
- **Layer 3 (Domain)**: Business rule invariants (e.g., expiration, min-subtotal) within the `Coupon` aggregate.

### 4. Input/Output with Domain Entities
- **Decision**: Use cases accept and return `Coupon` or `Money` domain objects.
- **Rationale**: Leverages established value objects and ensures consistency across context boundaries.

## Outstanding Questions
- *Resolved*: DI strategy confirmed as Pure DI.
- *Resolved*: Interface pattern confirmed as separate functional types.
