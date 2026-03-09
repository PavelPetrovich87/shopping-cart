---
work_package_id: WP03
title: Invariants, Concurrency & Final Validation
lane: "doing"
dependencies: []
base_branch: main
base_commit: 453860abc247688a593292703cc63c708fc5d95c
created_at: '2026-03-09T13:54:35.257751+00:00'
subtasks: [T007, T008, T009]
requirement_refs:
- FR-001
- FR-002
requirements: [FR-001, FR-002]
shell_pid: "17752"
agent: "Gemini"
---

# WP03: Invariants, Concurrency & Final Validation

## Objective
Finalize the `ProductVariant` Aggregate Root with concurrency protection and pricing integration.

## Context
As an Aggregate Root, `ProductVariant` must maintain consistency during concurrent updates. We use Optimistic Locking via a `version` field. Additionally, it must store its base price using the `Money` VO from the shared domain.

## Technical Guidance

### Subtask T007: Implement Optimistic Locking [FR-001]
- **Files**: `src/features/inventory/domain/ProductVariant.ts`
- **Logic**:
  1. Add a `version: number` property.
  2. Initialize to 0 in the constructor (or when loading from DB).
  3. Every state-changing method (`reserve`, `releaseReservation`, `confirmDepletion`) must increment `this.version++`.
  4. Note: The repository will check this version when saving, but the aggregate is responsible for updating it.

### Subtask T008: Implement base price management [FR-002]
- **Files**: `src/features/inventory/domain/ProductVariant.ts`
- **Integration**:
  1. Import `Money` from `src/shared/domain/Money.ts`.
  2. Add `basePrice: Money` to the `ProductVariant` properties and constructor.
  3. Ensure it is stored and accessible.

### Subtask T009: Comprehensive Unit Tests [FR-001, FR-002, FR-003, FR-004, FR-005]
- Create a test file: `src/features/inventory/domain/__tests__/ProductVariant.spec.ts`
- Scenarios to cover:
  - Constructor invariants (e.g., negative `totalOnHand` throws).
  - Reserving more than `availableStock` throws.
  - Releasing an unknown reservation is idempotent.
  - Confirming depletion subtracts physical stock correctly.
  - Confirming depletion of unknown reservation throws.
  - `version` increments correctly after each operation.
  - `availableStock` transitions correctly as time passes (mocking `now`).

## Definition of Done
- `version` increments on every state change.
- `basePrice` is correctly integrated as a `Money` VO.
- All domain invariants are enforced.
- Comprehensive unit tests pass.

## Implementation Command
```bash
spec-kitty implement WP03 --base WP02
```

## Activity Log

- 2026-03-09T13:54:35Z – Gemini – shell_pid=17752 – lane=doing – Assigned agent via workflow command
