# Research: Coupon Aggregate Root

## Decisions

### D-1: Validation Library Selection
- **Decision**: Use **Zod** for schema definition and invariant enforcement.
- **Rationale**: Zod provides a developer-friendly, type-safe way to define schemas and validate data at runtime. It aligns with the user's preference and ensures that the `Coupon` aggregate cannot be instantiated in an invalid state.
- **Alternatives considered**: Manual TypeScript guard clauses (rejected for complexity/verbosity), Joi (rejected in favor of better TS integration with Zod).

### D-2: Domain Event Emission
- **Decision**: Entities return events alongside their updated state.
- **Rationale**: Per the project constitution, domain entities must be pure and should not interact with the `EventBus` directly. Instead, methods like `calculateDiscount` or `validate` (if they mutate state or represent a significant domain occurrence) will return any generated domain events to be published by the calling application service.
- **Implementation**: `Coupon.validate(context): { isValid: boolean, events: DomainEvent[] }`.

### D-3: Money Value Object Integration
- **Decision**: Direct dependency on the `Money` value object for all currency operations.
- **Rationale**: Ensures consistency and prevents floating-point errors. The `Coupon` will accept and return `Money` instances for all financial logic.

## Best Practices
- **Zod Schemas**: Define schemas outside the class but within the same file for reuse in factory methods.
- **Immutability**: While the Aggregate Root can have internal state, consider returning new instances for significant state transitions if it simplifies the read model updates. However, for a standard aggregate, internal mutation with event tracking is the typical DDD pattern used here.
