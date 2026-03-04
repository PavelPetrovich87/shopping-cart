---
work_package_id: WP01
title: Implement Shared Money Value Object
lane: "for_review"
dependencies: []
base_branch: master
base_commit: 4bae38ac5d32453e23e58764cbc679543f856e49
created_at: '2026-03-04T15:35:27.473393+00:00'
subtasks: [T001, T002, T003, T004, T005, T006]
shell_pid: "14420"
agent: "antigravity"
---

# WP01: Implement Shared Money Value Object

## Objective
Implement the foundational `Money` Value Object in the `shared` domain context. This object must handle all monetary values as integer cents internally to ensure precision and provide a clean, immutable API for calculations and USD formatting.

## Context
This is a Wave 0 Foundation ticket (T-001). All other domains (Cart, Inventory, Pricing) will depend on this object for financial logic.

## Guidance

### Subtask T001: Create base `Money` class structure
- **Purpose**: Define the container and its internal state.
- **Steps**:
  1. Create `src/shared/domain/Money.ts`.
  2. Define a `Money` class.
  3. Add a `private readonly cents: number` property.
  4. Ensure the constructor is private or protected to force use of factory methods.
- **Files**: `src/shared/domain/Money.ts`

### Subtask T002: Implement static factory methods
- **Purpose**: Provide controlled ways to create `Money` instances.
- **Steps**:
  1. `static fromCents(cents: number): Money`: Returns a new instance using raw cents. Validate that `cents` is an integer.
  2. `static fromPrice(price: number): Money`: Converts a decimal price (e.g., 25.99) to cents (2599) via `Math.round(price * 100)`.
- **Validation**:
  - `Money.fromPrice(10.50)` should store 1050 cents.

### Subtask T003: Implement arithmetic operations
- **Purpose**: Enable financial math without primitive leaks.
- **Steps**:
  1. `add(other: Money): Money`: Returns NEW instance with sum.
  2. `subtract(other: Money): Money`: Returns NEW instance with difference.
  3. `multiply(factor: number): Money`: Returns NEW instance with product. Use `Math.round()` for the resulting cents.
- **Constraint**: **IMMUTABILITY**. Never modify the internal state of an existing instance.

### Subtask T004: Implement comparison
- **Purpose**: Check if two monetary values are identical.
- **Steps**:
  1. `equals(other: Money): boolean`: Compare internal `cents`.
- **Validation**:
  - `Money.fromCents(100).equals(Money.fromCents(100))` is true.

### Subtask T005: Implement USD formatting
- **Purpose**: Human-readable display of money.
- **Steps**:
  1. `format(locale: string = 'en-US'): string`: Use `Intl.NumberFormat`.
  2. Options: `style: 'currency'`, `currency: 'USD'`.
- **Files**: `src/shared/domain/Money.ts`

### Subtask T006: Add comprehensive unit tests (Vitest)
- **Purpose**: Ensure correctness and precision.
- **Steps**:
  1. Create `src/shared/domain/__tests__/Money.spec.ts`.
  2. Test all factory methods (price to cents conversion).
  3. Test arithmetic (`add`, `subtract`, `multiply`) including rounding for multiplication.
  4. Test immutability (verify different references).
  5. Test formatting (standard USD output).
- **Files**: `src/shared/domain/__tests__/Money.spec.ts`

## Definition of Done
- [ ] `Money` class implemented and follows immutability rules.
- [ ] All arithmetic operations use integer cents internally.
- [ ] `format()` returns correct USD string.
- [ ] 100% test coverage for `Money.ts` with Vitest.
- [ ] No floating-point errors in calculations.

## Risks & Reviewer Guidance
- **Precision**: Ensure `multiply` uses `Math.round` to avoid fractional cents.
- **Encapsulation**: The internal `cents` should not be exposed or modified directly.

## Activity Log

- 2026-03-04T15:35:28Z – antigravity – shell_pid=14420 – lane=doing – Assigned agent via workflow command
- 2026-03-04T15:39:59Z – antigravity – shell_pid=14420 – lane=for_review – Implementation complete with 100% test coverage
