# Tasks: Shared Fixtures from data/

**Feature Path**: `kitty-specs/003-shared-fixtures-types-and-exports`

## Work Packages

### WP01: Shared Fixtures Core Implementation
**Goal**: Create TypeScript types for JSON data and export typed constants.
**Priority**: 🟢 High (Foundation)

**Subtasks**:
- [ ] **T001**: Define data record interfaces in `src/shared/fixtures/types.ts`
- [ ] **T002**: Implement centralized data exports in `src/shared/fixtures/index.ts`
- [ ] **T003**: Verify types and imports with `src/shared/fixtures/verify.test.ts`
- [ ] **T004**: Cleanup temporary verification files

**Implementation Sketch**:
1. Inspect `data/*.json` and create matching interfaces with `Record` suffix in `types.ts`.
2. Use snake_case for fields to match JSON exactly.
3. In `index.ts`, import JSON files (using TS wildcards if needed) and cast them to the defined types.
4. Export as `productsData`, `inventoryData`, etc.
5. Create a minimal test file to ensure `tsc` and `jest` (or vitest) are happy.

**Dependencies**: None
**Estimated Prompt Size**: ~350 lines
**Prompt Path**: `tasks/WP01-shared-fixtures-core.md`
