---
work_package_id: WP04
title: Coupon Repository Port
lane: "doing"
dependencies: [WP01]
base_branch: 005-coupon-aggregate-root-WP01
base_commit: 8901e797b86224fc21cd141349770dbd40096b43
created_at: '2026-03-09T14:05:25.847213+00:00'
subtasks: [T013, T014, T015]
requirement_refs:
- FR-1
shell_pid: "20566"
---

# Objective
Define the repository port interface for the `Coupon` aggregate root, along with the associated domain errors. This contract will be used by application services to interact with coupon persistence.

# Context
In Hexagonal Architecture, ports define the contract that adapters must fulfill. The `ICouponRepository` is a driven port located in the domain layer (or domain/ports).

# Guidance

### T013: Create ICouponRepository interface
- Create `src/features/pricing/domain/ports/ICouponRepository.ts`.
- Define an interface that includes:
  - `findByCode(code: string): Promise<Coupon | null>`
  - `save(coupon: Coupon): Promise<void>`
  - `findAll(): Promise<Coupon[]>`

### T014: Define CouponNotFoundError and InvalidCouponDataError
- Create `src/features/pricing/domain/errors/CouponErrors.ts`.
- Define custom domain error classes that extend the project's base error (if one exists) or `Error`.
- `CouponNotFoundError`: Includes the code.
- `InvalidCouponDataError`: Includes the validation errors (e.g., from Zod).

### T015: Add findByCode, save, and findAll methods to the interface
- Ensure the methods use the `Coupon` entity and the appropriate domain error types.
- The interface must remain technology-agnostic (no references to databases, ORMs, or external APIs).

# Files
- `src/features/pricing/domain/ports/ICouponRepository.ts` (new)
- `src/features/pricing/domain/errors/CouponErrors.ts` (new)

# Definition of Done
- [ ] `ICouponRepository` interface defined.
- [ ] Domain-specific errors created.
- [ ] Contract correctly uses domain entities.
- [ ] No technology-specific implementation details leak into the interface.

# Reviewer Guidance
- Ensure the port follows Hexagonal principles and remains isolated from infrastructure.
- Verify that the error types are descriptive and appropriate for the domain.
- Check that the contract covers all necessary persistence operations for the Pricing domain.
---
To implement this work package, run:
`spec-kitty implement WP04 --base WP01`
