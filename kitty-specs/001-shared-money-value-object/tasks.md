# Tasks: Shared Money Value Object

## Work Packages

### WP01: Implement Shared Money Value Object
- **Goal**: Create the immutable `Money` value object with arithmetic and formatting.
- **Priority**: High (Foundational)
- **Subtasks**:
  - [x] T001: Create base `Money` class structure
  - [x] T002: Implement static factory methods (`fromCents`, `fromPrice`)
  - [x] T003: Implement arithmetic operations (`add`, `subtract`, `multiply`)
  - [x] T004: Implement comparison (`equals`)
  - [x] T005: Implement USD formatting (`format`)
  - [ ] T006: Add comprehensive unit tests (Vitest)
- **Implementation Sketch**:
  1. Define the class and private state.
  2. Add factory methods for object creation.
  3. Implement immutable arithmetic (return new instances).
  4. Add formatting and equality logic.
  5. Verify with Vitest.
- **Prompt**: [WP01-implement-money-vo.md](tasks/WP01-implement-money-vo.md)
- **Estimated Size**: ~400 lines
