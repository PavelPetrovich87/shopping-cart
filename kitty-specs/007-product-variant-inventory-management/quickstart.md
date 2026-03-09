# Quickstart: ProductVariant Aggregate Implementation

## Core Goal
Implement the `ProductVariant` Aggregate Root and `StockReservation` Value Object.

## Prerequisites
- `shared/domain/Money.ts` (T-001) is complete.
- `shared/events/DomainEvent.ts` (T-002) is complete.

## Implementation Steps
1. Create `src/features/inventory/domain/StockReservation.ts` (Value Object).
2. Create `src/features/inventory/domain/ProductVariant.ts` (Aggregate Root).
3. Implement `availableStock` method with expiry logic.
4. Implement `reserve`, `releaseReservation`, and `confirmDepletion`.
5. Ensure `version` field increments on every state change.
6. Publish domain events via internal `addEvent` method.

## Verification
Run unit tests checking:
- `availableStock` handles both active and expired reservations correctly.
- Reservations fail if they exceed `availableStock`.
- Confirming depletion reduces `totalOnHand` and increments `sold`.
- Events are emitted with correct data.
