---
work_package_id: WP02
title: Core Use Cases (Availability & Reservation)
lane: "done"
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
shell_pid: "75733"
agent: "Gemini"
reviewed_by: "PavelPetrovich87"
review_status: "approved"
---

## Objective
Implement the core use cases for checking stock availability and reserving stock.

## Tasks
- [x] Implement `CheckStockAvailability` use case in `src/features/inventory/application/use-cases/CheckStockAvailability.ts`
- [x] Implement `ReserveStock` use case in `src/features/inventory/application/use-cases/ReserveStock.ts`
- [x] Implement `IEventBus` usage in `ReserveStock` for publishing `StockReserved` events

## Verification
- [x] Unit tests for `CheckStockAvailability` pass
- [x] Unit tests for `ReserveStock` pass (including event publishing verification)

## Activity Log

- 2026-03-12T14:03:41Z – Gemini – shell_pid=73058 – lane=doing – Assigned agent via workflow command
- 2026-03-12T14:05:44Z – Gemini – shell_pid=73058 – lane=for_review – Core use cases (CheckStockAvailability, ReserveStock) implemented with unit tests in .worktrees/008-inventory-ports-and-use-cases-WP02
- 2026-03-12T14:24:02Z – Gemini – shell_pid=75733 – lane=doing – Started review via workflow command
- 2026-03-12T14:24:34Z – Gemini – shell_pid=75733 – lane=done – Review passed: CheckStockAvailability and ReserveStock use cases correctly implemented with event publishing and unit test coverage.
