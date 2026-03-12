---
dependencies: [WP01]
base_branch: 008-inventory-ports-and-use-cases-WP01
base_commit: 2074cdd18d118849472a299d49a783e0ae82c94f
created_at: '2026-03-12T14:03:41.101376+00:00'
feature: 008-inventory-ports-and-use-cases
id: WP02
name: Core Use Cases (Availability & Reservation)
requirement-refs: [FR-001, FR-002, FR-003, FR-004, FR-005]
requirement_refs: [FR-001, FR-002, FR-003, FR-004, FR-005]
status: todo
lane: "doing"
shell_pid: "73058"
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
