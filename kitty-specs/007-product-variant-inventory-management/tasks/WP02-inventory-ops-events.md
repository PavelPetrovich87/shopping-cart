---
work_package_id: WP02
title: Core Inventory Operations & Events
lane: "doing"
dependencies: []
base_branch: main
base_commit: 52891743b6631ed1f14bd86405c811e4e3992525
created_at: '2026-03-09T13:52:23.239741+00:00'
subtasks: [T004, T005, T006, T010]
requirement_refs:
- FR-004
- FR-005
requirements: [FR-004, FR-005]
shell_pid: "29954"
agent: "antigravity"
---

# WP02: Core Inventory Operations & Events

## Objective
Implement the lifecycle operations of the `ProductVariant` Aggregate Root, including reserving, releasing, and depleting stock, while ensuring appropriate domain events are emitted.

## Context
Inventory management relies on strict transitions: stock is first **reserved**, then either **depleted** (sale) or **released** (cancellation). Each transition must be validated against current stock levels and notify other parts of the system via domain events.

## Technical Guidance

### Subtask T004: Implement `reserve(orderId, qty, ttl, now)` [FR-004, FR-005]
- **Files**: `src/features/inventory/domain/ProductVariant.ts`
- **Logic**:
  1. Call `this.availableStock(now)`.
  2. If `availableStock < qty`, throw a domain error (e.g., `InsufficientStockError`).
  3. Create a new `StockReservation` with `expiresAt = now + ttl`.
  4. Add to `this.reservations`.
  5. Record `StockReserved` event.

### Subtask T005: Implement `releaseReservation(orderId)` [FR-004, FR-005]
- **Files**: `src/features/inventory/domain/ProductVariant.ts`
- **Logic**:
  1. Find and remove the reservation for the given `orderId`.
  2. If found, record `StockReleased` event.
  3. If not found, do nothing (idempotent).

### Subtask T006: Implement `confirmDepletion(orderId)` [FR-004, FR-005]
- **Files**: `src/features/inventory/domain/ProductVariant.ts`
- **Logic**:
  1. Find the reservation for `orderId`.
  2. If not found, throw error (depletion requires a prior reservation).
  3. Subtract reservation quantity from `this.totalOnHand`.
  4. Increment `this.sold` by the quantity.
  5. Remove the reservation.
  6. Record `StockDepleted` event.

### Subtask T010: Integrate Domain Events [FR-005]
- Ensure `ProductVariant` extends a base `AggregateRoot` or has an `events` collection.
- Every state change should call `this.addEvent(new SomeEvent(...))`.

## Definition of Done
- `reserve()` correctly validates stock and emits events.
- `releaseReservation()` removes the hold and emits events.
- `confirmDepletion()` updates physical stock levels and emits events.
- Unit tests verify the sequence: Reserve -> Confirm -> (Check stock level).
- Unit tests verify the sequence: Reserve -> Release -> (Check stock level).

## Implementation Command
```bash
spec-kitty implement WP02 --base WP01
```

## Activity Log

- 2026-03-09T13:52:24Z – Gemini – shell_pid=16798 – lane=doing – Assigned agent via workflow command
- 2026-03-09T13:53:43Z – Gemini – shell_pid=16798 – lane=for_review – Implemented reserve, releaseReservation, confirmDepletion and domain event emission. All tests pass.
- 2026-03-10T07:41:17Z – antigravity – shell_pid=29954 – lane=doing – Started review via workflow command
