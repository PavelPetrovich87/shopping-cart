---
feature: 008-inventory-ports-and-use-cases
id: WP03
name: Reservation Management (Release & Depletion)
status: todo
requirement-refs: [FR-001, FR-002, FR-003, FR-004, FR-005]
requirement_refs: [FR-001, FR-002, FR-003, FR-004, FR-005]
dependencies: [WP02]
---

## Objective
Implement use cases for releasing reservations and confirming stock depletion.

## Tasks
- [ ] Implement `ReleaseStockReservation` use case in `src/features/inventory/application/use-cases/ReleaseStockReservation.ts`
- [ ] Implement `ConfirmStockDepletion` use case in `src/features/inventory/application/use-cases/ConfirmStockDepletion.ts`
- [ ] Ensure events are published for release and depletion

## Verification
- [ ] Unit tests for `ReleaseStockReservation` pass
- [ ] Unit tests for `ConfirmStockDepletion` pass
