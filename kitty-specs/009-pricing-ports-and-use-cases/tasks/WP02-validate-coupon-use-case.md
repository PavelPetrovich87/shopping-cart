---
work_package_id: WP02
title: Validate Coupon Use Case
lane: "doing"
dependencies: [WP01]
base_branch: 009-pricing-ports-and-use-cases-WP01
base_commit: acf81164a3bdc1091c74699448a12625ddabbdc3
created_at: '2026-03-12T14:19:30.828989+00:00'
subtasks: [T006, T007, T008]
requirement_refs: [FR-02]
shell_pid: "74798"
agent: "gemini-cli"
---

# Work Package: WP02 - Validate Coupon Use Case

## Objective
Implement the `ValidateCoupon` use case logic and its automated unit tests.

## Context
Following the design alignment, use cases are implemented as standalone functions that return their implementation via a factory (to allow for DI). This use case is responsible for coordinating the retrieval of a coupon from the repository and performing basic checks before returning the domain's validity state.

## Technical Guidance

### Subtask T006: Implement ValidateCoupon function
**Purpose**: Core implementation of the validation logic.
**Steps**:
1. Create `src/features/pricing/application/use-cases/ValidateCoupon.ts`.
2. Export a factory `createValidateCoupon(repository: ICouponRepository): ValidateCoupon`.
3. Implement the internal logic:
   - Check if the code is empty/whitespace → return failure: "Please enter a valid code".
   - Retrieve the coupon using the `findByCode` method of the repository.
   - If coupon not found → return failure: "Sorry, but this coupon doesn't exist".
   - If coupon found → return success result with details.
**Validation**:
- [ ] Returns correct `CouponResult` for each scenario.
- [ ] Logic stays in the application layer, delegating to the domain aggregate where appropriate.

### Subtask T007: Unit tests for ValidateCoupon
**Purpose**: Ensure the use case works as expected for all defined scenarios.
**Steps**:
1. Create `src/features/pricing/application/use-cases/__tests__/ValidateCoupon.spec.ts`.
2. Use Vitest to mock `ICouponRepository`.
3. Test empty string input.
4. Test repository not found (returns null).
5. Test repository returns a valid `Coupon`.
6. Test repository returns an invalid/expired `Coupon` (checking aggregate's logic).
**Validation**:
- [ ] All tests pass.
- [ ] Edge cases (whitespace, special characters) are covered.

### Subtask T008: Domain event validation
**Purpose**: Verify that the validation process generates correct domain events.
**Steps**:
1. In the unit tests, verify that `Coupon.validate()` is called and its generated events are captured.
2. Ensure that the use case doesn't publish events yet (that's for the context orchestration later), but correctly receives them from the aggregate.
**Validation**:
- [ ] `CouponValidated` and `CouponValidationFailed` events are appropriately generated based on the scenario.

## Definition of Done
- `ValidateCoupon` implementation complete.
- Unit tests covering all scenarios (success and failures).
- Correct domain results and errors returned.

## Reviewer Guidance
Check that the error messages match the feature specification exactly.
- "Please enter a valid code" (empty/malformed)
- "Sorry, but this coupon doesn't exist" (not found)
- Ensure the factory pattern is used for dependency injection.

## Activity Log

- 2026-03-12T14:19:31Z – gemini-cli – shell_pid=74798 – lane=doing – Assigned agent via workflow command
