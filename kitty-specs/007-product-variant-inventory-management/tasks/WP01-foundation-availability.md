---
work_package_id: WP01
title: Foundation & Availability Calculation
lane: "doing"
dependencies: []
base_branch: main
base_commit: de3ca048ab6359e5e37dbbdd88134d019eb469e1
created_at: '2026-03-09T13:45:49.505630+00:00'
subtasks: [T001, T002, T003]
requirement_refs:
- FR-001
- FR-003
requirements: [FR-001, FR-003]
shell_pid: "15527"
agent: "Gemini"
---

# WP01: Foundation & Availability Calculation

## Objective
Implement the foundational domain entities for the Inventory context: `StockReservation` and `ProductVariant`. The core requirement is the calculation of available stock that dynamically ignores expired reservations.

## Context
In our system, `ProductVariant` is an Aggregate Root that manages inventory. It stores a list of temporary reservations (`StockReservation`). To determine `availableStock`, we must subtract only **active** (non-expired) reservations from the `totalOnHand` physical quantity.

## Technical Guidance

### Subtask T001: Implement `StockReservation` Value Object [FR-003]
- **Files**: `src/features/inventory/domain/StockReservation.ts`
- **Purpose**: A Value Object representing a temporary hold on stock.
- **Attributes**:
  - `orderId: string`
  - `quantity: number`
  - `expiresAt: Date`
- **Validation**: `quantity` must be > 0.
- **Comparison**: Since it's a VO, implement an `equals()` method that compares all three fields.

### Subtask T002: Implement `ProductVariant` Aggregate Root Base [FR-001]
- **Files**: `src/features/inventory/domain/ProductVariant.ts`
- **Purpose**: The main entity for managing stock levels.
- **Attributes**:
  - `id: SkuId`
  - `totalOnHand: number` (Physical items in warehouse, must be >= 0)
  - `sold: number` (Cumulative total of units permanently sold)
  - `reservations: StockReservation[]` (Internal list of holds)
- **Validation**: Enforce `totalOnHand >= 0` in the constructor.

### Subtask T003: Implement `availableStock` logic [FR-003]
- **Method Signature**: `public availableStock(now: Date): number`
- **Logic**:
  1. Filter `this.reservations` for those where `reservation.expiresAt > now`.
  2. Sum the quantities of these active reservations.
  3. Return `this.totalOnHand - activeReservationsSum`.
- **Note**: Passing `now` as a parameter is crucial for testability without clock-mocking.

## Definition of Done
- `StockReservation` VO is immutable and validated.
- `ProductVariant` AR is initialized with correct types.
- `availableStock` correctly filters expired reservations.
- Unit tests verify the calculation logic with multiple scenarios (no reservations, expired ones, all active).

## Implementation Command
```bash
spec-kitty implement WP01
```

## Activity Log

- 2026-03-09T13:45:50Z – Gemini – shell_pid=15527 – lane=doing – Assigned agent via workflow command
