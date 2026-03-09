---
work_package_id: WP03
title: Domain Events Integration
lane: planned
dependencies: [WP02]
subtasks: [T009, T010, T011, T012]
requirement_refs:
- FR-6
requirements: [FR-6]
---

# Objective
Update the `Coupon` aggregate root to emit domain events when key business actions occur, following the project's DDD standards for pure entities.

# Context
According to the project constitution, domain entities must remain pure and should not interact with an event bus directly. Instead, methods that result in events should return them to the caller (e.g., an application service) for publication.

# Guidance

### T009: Define CouponValidated, CouponValidationFailed, and DiscountCalculated event types
- Create `src/features/pricing/domain/events/CouponEvents.ts`.
- Define classes or interfaces for:
  - `CouponValidatedDomainEvent`: Includes the code.
  - `CouponValidationFailedDomainEvent`: Includes the code and the error message.
  - `DiscountCalculatedDomainEvent`: Includes the code, subtotal, and discount amount.
- Ensure all events extend the common `DomainEvent` base.

### T010: Update validate() to return CouponValidated or CouponValidationFailed
- Modify the `validate()` method signature in `Coupon.ts` to return `{ isValid: boolean, events: DomainEvent[] }`.
- Ensure the appropriate event is added to the `events` array.

### T011: Update calculateDiscount() to return DiscountCalculated with the amount
- Modify the `calculateDiscount()` method signature in `Coupon.ts` to return `{ discount: Money, events: DomainEvent[] }`.
- Include the `DiscountCalculatedDomainEvent` in the `events` array.

### T012: Ensure events follow the project's DomainEvent base structure
- Verify the base `DomainEvent` definition in `src/shared/events/DomainEvent.ts`.
- Ensure all new event types follow the same pattern (e.g., including `occurred_at`).

# Files
- `src/features/pricing/domain/events/CouponEvents.ts` (new)
- `src/features/pricing/domain/Coupon.ts` (modified)
- `src/features/pricing/domain/__tests__/Coupon.spec.ts` (modified)

# Definition of Done
- [ ] New event types correctly defined.
- [ ] `validate()` returns validation success/failure events.
- [ ] `calculateDiscount()` returns calculation event.
- [ ] Unit tests verify that methods return the expected events alongside their results.

# Reviewer Guidance
- Ensure the events correctly capture the domain intent.
- Verify that the aggregate remains pure and doesn't dependencies on the EventBus.
- Check for consistency in event payloads.
---
To implement this work package, run:
`spec-kitty implement WP03 --base WP02`
