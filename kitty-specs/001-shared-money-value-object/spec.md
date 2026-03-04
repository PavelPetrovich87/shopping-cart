# Specification: Shared Money Value Object

**Status**: Draft
**Feature**: 001-shared-money-value-object
**Mission**: software-dev

## Goal
Implement a robust, immutable `Money` value object to handle all financial calculations in the system. This object will prevent floating-point errors by wrapping currency amounts as integer cents and provide a consistent interface for monetary operations and formatting.

## User Scenarios & Testing
- **Scenario: Price Representation**
  - When a product price is $25.00, the `Money` object should store 2500 cents internally.
  - Verification: `Money.fromPrice(25).cents === 2500`
- **Scenario: Arithmetic Operations**
  - Given two `Money` instances ($10.50 and $5.25), adding them should result in a new `Money` instance of $15.75.
  - Verification: `Money.fromPrice(10.5).add(Money.fromPrice(5.25)).format() === "$15.75"`
- **Scenario: Formatting**
  - A `Money` instance representing 1234 cents should format as "$12.34".
  - Verification: `Money.fromCents(1234).format() === "$12.34"`

## Functional Requirements
- **FR-1: Internal Integer Storage**
  - All monetary values must be stored as integer cents to avoid precision issues associated with floating-point arithmetic.
- **FR-2: Immutability**
  - The `Money` object must be immutable. Every operation (`add`, `subtract`, `multiply`) must return a new instance of `Money`.
- **FR-3: Arithmetic Operations**
  - Must support addition (`add`), subtraction (`subtract`), and multiplication (`multiply`).
- **FR-4: Comparison**
  - Must support equality check (`equals`).
- **FR-5: Formatting**
  - Must provide a `format()` method that returns a locale-aware USD string (e.g., "$1,234.56").
- **FR-6: Factory Methods**
  - Must provide static factory methods: `fromCents(number)` and `fromPrice(number)`.

## Success Criteria
- **SC-1**: All financial calculations in the system use the `Money` object instead of primitive numbers.
- **SC-2**: 100% of arithmetic unit tests pass, confirming no precision loss.
- **SC-3**: Formatting produces consistent, human-readable USD strings across different locales.
- **SC-4**: All operations produce new instances, confirmed via reference equality checks in tests.

## Key Entities
- **Money (Value Object)**: The core object wrapping cents, operations, and formatting.

## Assumptions
- The system only supports USD ($) for the initial version.
- "Locale-aware" specifically refers to standard US formatting conventions for now.
- Negative money values are allowed (e.g., for discounts or refunds).
