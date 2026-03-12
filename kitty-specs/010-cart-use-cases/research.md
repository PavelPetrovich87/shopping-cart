# Research: Cart Use Cases Implementation
*Path: kitty-specs/010-cart-use-cases/research.md*

## Decision: Standalone Functional Handlers
**Chosen**: Exported asynchronous functions for each use case.
**Rationale**: Aligns with the user's preference for standalone functional handlers over class-based or mediator-based approaches. This simplifies testing and reduces boilerplate.

## Decision: Result Pattern for Error Handling
**Chosen**: Using the existing `Result<T, E>` type from `src/shared/domain/Result.ts`.
**Rationale**: Provides a consistent, type-safe way to handle domain errors (e.g., `OUT_OF_STOCK`, `INVALID_COUPON`) without relying on exceptions for expected business failures.

## Decision: Event-Driven but Pure Orchestration
**Chosen**: Use cases return `{ updatedCart: Cart, events: DomainEvent[] }` in the `Result` payload.
**Rationale**: Per user's strict requirement for purity, the use cases will not perform side effects (saving to repository or publishing to event bus). The caller will handle these responsibilities.

## Decision: Missing Domain Events
**Chosen**: Extend `src/features/cart/domain/CartEvents.ts` to include:
- `CouponAppliedToCart`
- `CouponRemovedFromCart`
- `CheckoutInitiated`
**Rationale**: These events are required by the specification but were missing from the initial domain implementation.

## Decision: IInventoryService & IPricingService Usage
**Chosen**: Inject ports into the use cases.
- `AddItemToCart`: Calls `IInventoryService.checkStockAvailability`.
- `ApplyCouponToCart`: Calls `IPricingService.validateCoupon`.
- `InitiateCheckout`: Calls `IInventoryService.checkStockAvailability` for each item.
**Rationale**: Enforces domain invariants that depend on external contexts.
