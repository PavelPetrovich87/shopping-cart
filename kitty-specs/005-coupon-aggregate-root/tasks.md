# Tasks: Coupon Aggregate Root

## Phase 1: Foundation & Core Domain

### WP01: Coupon Domain Entity & Zod Schema
- **Requirements**: FR-1, FR-4, FR-5
- **Goal**: Implement the core `Coupon` aggregate root with Zod validation.
- **Priority**: High
- **Test Criteria**: Unit tests for instantiation and validation rules.
- **Subtasks**:
  - [x] **T001**: Define `Coupon` properties and `discountType` enum using Zod. [P]
  - [x] **T002**: Implement `Coupon` class with static factory `create` method.
  - [x] **T003**: Add internal validation logic for `Active`/`Inactive` and `expirationDate`.
  - [x] **T004**: Implement basic `isValid()` method.
- **Implementation Sketch**: Start with the Zod schema to enforce invariants, then build the class around it.
- **Estimated Prompt Size**: ~350 lines

### WP02: Discount Calculation Logic
- **Requirements**: FR-2, FR-3
- **Goal**: Implement the business logic for flat and percentage discounts.
- **Priority**: High
- **Dependencies**: WP01
- **Test Criteria**: Unit tests for all discount scenarios, including caps.
- **Subtasks**:
  - [ ] **T005**: Implement `calculateDiscount(subtotal: Money)` for `FLAT` type. [P]
  - [ ] **T006**: Implement `calculateDiscount(subtotal: Money)` for `PERCENTAGE` type. [P]
  - [ ] **T007**: Add logic to cap discounts at the subtotal (prevent negative totals).
  - [ ] **T008**: Ensure `Money` value object is correctly integrated for all calculations.
- **Implementation Sketch**: Leverage the `Money` VO for arithmetic. Ensure the percentage calculation handles rounding correctly via `Money` methods.
- **Estimated Prompt Size**: ~400 lines

## Phase 2: Domain Events & Persistence

### WP03: Domain Events Integration
- **Requirements**: FR-6
- **Goal**: Add domain event emission to the `Coupon` aggregate.
- **Priority**: Medium
- **Dependencies**: WP02
- **Test Criteria**: Verify that the correct events are returned from domain methods.
- **Subtasks**:
  - [ ] **T009**: Define `CouponValidated`, `CouponValidationFailed`, and `DiscountCalculated` event types. [P]
  - [ ] **T010**: Update `validate()` to return `CouponValidated` or `CouponValidationFailed`.
  - [ ] **T011**: Update `calculateDiscount()` to return `DiscountCalculated` with the amount.
  - [ ] **T012**: Ensure events follow the project's `DomainEvent` base structure.
- **Implementation Sketch**: Modify method signatures to return `{ result, events }` as per the project constitution.
- **Estimated Prompt Size**: ~380 lines

### WP04: Coupon Repository Port
- **Requirements**: FR-1
- **Goal**: Define the repository interface and domain errors.
- **Priority**: Medium
- **Dependencies**: WP01
- **Test Criteria**: N/A (Interface definition).
- **Subtasks**:
  - [ ] **T013**: Create `ICouponRepository` interface. [P]
  - [ ] **T014**: Define `CouponNotFoundError` and `InvalidCouponDataError`. [P]
  - [ ] **T015**: Add `findByCode`, `save`, and `findAll` methods to the interface.
- **Implementation Sketch**: Place the interface in the domain/ports layer. Ensure it only references domain entities.
- **Estimated Prompt Size**: ~300 lines
