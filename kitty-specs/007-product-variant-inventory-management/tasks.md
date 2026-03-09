# Work Packages: ProductVariant Inventory Management

## Phase 1: Foundational Domain Model [FR-001, FR-003]

### WP01: Foundation & Availability Calculation [FR-001, FR-003]
**Goal**: Implement the `StockReservation` Value Object and the `ProductVariant` Aggregate Root with its core properties and the time-aware `availableStock` calculation.
**Priority**: 1 (Critical Path)
**Test Criteria**: `availableStock` correctly ignores expired reservations and includes active ones.
**Requirements**: FR-001, FR-003

- [x] T001 Implement `StockReservation` Value Object [FR-003]
- [x] T002 Implement `ProductVariant` Aggregate Root properties and constructor [FR-001]
- [x] T003 Implement `availableStock` logic with expiry date comparison [FR-003]

---

## Phase 2: Lifecycle Operations [FR-004, FR-005]

### WP02: Core Inventory Operations & Events [FR-004, FR-005]
**Goal**: Add the ability to reserve, release, and confirm depletion of stock, ensuring domain events are emitted for each action.
**Priority**: 2
**Depends on**: WP01
**Test Criteria**: Reservation fails if `availableStock < qty`; Depletion correctly updates physical stock.
**Requirements**: FR-004, FR-005

- [x] T004 Implement `reserve(orderId, qty, ttl, now)` with validation [FR-004, FR-005]
- [x] T005 Implement `releaseReservation(orderId)` [FR-004, FR-005]
- [x] T006 Implement `confirmDepletion(orderId)` [FR-004, FR-005]
- [x] T010 Integrate domain event collection within the AR [FR-005]

---

## Phase 3: Robustness & Pricing [FR-001, FR-002]

### WP03: Invariants, Concurrency & Final Validation [FR-001, FR-002]
**Goal**: Implement optimistic locking and integrate the `Money` VO for base pricing, concluding with exhaustive unit tests.
**Priority**: 3
**Depends on**: WP02
**Test Criteria**: `version` increments on every state change; Base price uses `Money` VO correctly.
**Requirements**: FR-001, FR-002

- [x] T007 Implement Optimistic Locking with `version` field [FR-001]
- [x] T008 Implement base price management using `Money` VO [FR-002]
- [x] T009 Comprehensive Unit Tests [FR-001, FR-002, FR-003, FR-004, FR-005]
