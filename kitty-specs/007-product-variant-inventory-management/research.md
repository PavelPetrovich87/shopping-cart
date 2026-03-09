# Research: ProductVariant Concurrency & Inventory Calculations

## Decision: Optimistic Locking with `version` field
**Rationale**: In a hexagonal architecture, protecting invariants like `totalOnHand >= 0` requires preventing concurrent updates from overwriting each other. By adding a `version` number to the `ProductVariant` aggregate, the repository can detect "stale" saves. If the version in the state/DB is different from the version held by the aggregate, a `ConcurrencyConflict` error is thrown, forcing the user to retry with fresh data.

## Decision: Internal Availability Calculation
**Rationale**: Calculating `availableStock` inside the aggregate (filtering `StockReservation` by `expiresAt`) ensures that business rules are encapsulated. It prevents the need for background cron jobs to "clear" expired reservations for the purpose of availability reporting, although periodic cleanup is still recommended for memory/storage efficiency.

## Decision: "Now" Dependency Injection
**Rationale**: To make unit tests deterministic, the current timestamp must be passed into the `availableStock` getter or reservation methods.
- Alternative: Global `Date.now()`.
- Reason for rejection: Makes testing edge cases (e.g., exactly at expiration) impossible without brittle clock mocking.
