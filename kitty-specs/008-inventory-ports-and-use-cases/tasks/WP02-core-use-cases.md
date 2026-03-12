---
feature: 008-inventory-ports-and-use-cases
id: WP02
name: Core Use Cases (Availability & Reservation)
status: todo
requirement-refs: [FR-001, FR-002, FR-003, FR-004, FR-005]
requirement_refs: [FR-001, FR-002, FR-003, FR-004, FR-005]
dependencies: [WP01]
---

## Objective
Implement the core use cases for checking stock availability and reserving stock.

## Tasks
- [ ] Implement `CheckStockAvailability` use case in `src/features/inventory/application/use-cases/CheckStockAvailability.ts`
- [ ] Implement `ReserveStock` use case in `src/features/inventory/application/use-cases/ReserveStock.ts`
- [ ] Implement `IEventBus` usage in `ReserveStock` for publishing `StockReserved` events

## Verification
- [ ] Unit tests for `CheckStockAvailability` pass
- [ ] Unit tests for `ReserveStock` pass (including event publishing verification)
