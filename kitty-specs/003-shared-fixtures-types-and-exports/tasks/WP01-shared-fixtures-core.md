---
work_package_id: "WP01"
title: "Shared Fixtures Core Implementation"
lane: "planned"
dependencies: []
requirement-refs: ["FR-001", "FR-002", "FR-003", "FR-004"]
requirement_refs: ["FR-001", "FR-002", "FR-003", "FR-004"]
subtasks: ["T001", "T002", "T003", "T004"]
---

# WP01: Shared Fixtures Core Implementation

## Objective
Create a centralized, type-safe module for all mock data located in `data/*.json`. This ensures that all mock data used in repositories and tests has a single source of truth and is properly typed according to the Domain-Driven Design patterns of the project.

## Context
The project uses JSON files in `data/` to represent raw data from external sources (API responses, database exports). We need to import these into TypeScript and provide interfaces that match the JSON structure exactly (using the `Record` suffix for these DTO-like objects).

## Subtasks

### T001: Define data record interfaces in `src/shared/fixtures/types.ts`
**Purpose**: Create TypeScript interfaces that mirror the JSON structure of our data files.

**Steps**:
1. Inspect the following files in `data/`:
   - `products.json` -> `ProductRecord`
   - `inventory.json` -> `InventoryRecord`
   - `coupons.json` -> `CouponRecord`
   - `categories.json` -> `CategoryRecord`
   - `collections.json` -> `CollectionRecord`
   - `product-images.json` -> `ProductImageRecord`
   - `sample-cart.json` -> `CartRecord`
2. Define these interfaces in `src/shared/fixtures/types.ts`.
3. **Important**: Use snake_case for property names to match JSON keys.
4. All date strings should be typed as `string`.

### T002: Implement centralized data exports in `src/shared/fixtures/index.ts`
**Purpose**: Export typed constants for each data file.

**Steps**:
1. In `src/shared/fixtures/index.ts`, import each JSON file.
2. Export them as typed constants:
   - `export const productsData = productsJson as ProductRecord[];`
   - `export const inventoryData = inventoryJson as InventoryRecord[];`
   - ...and so on.

### T003: Verify types and imports with `src/shared/fixtures/verify.test.ts`
**Purpose**: Ensure the fixtures are correctly typed and can be imported.

**Steps**:
1. Create `src/shared/fixtures/verify.test.ts`.
2. Write simple tests (or just type assertions) to verify that properties are accessible and correctly typed.
3. Run `npx tsc --noEmit` to verify type safety.
4. (Optional) Run tests if a test runner is configured.

### T004: Cleanup temporary verification files
**Purpose**: Remove the verification test once confirmed.

**Steps**:
1. Delete `src/shared/fixtures/verify.test.ts` after successful type checking.

## Definition of Done
- [ ] `src/shared/fixtures/types.ts` defines all required interfaces.
- [ ] `src/shared/fixtures/index.ts` exports all data as typed constants.
- [ ] No TypeScript errors in the project related to these new files.
- [ ] No `any` types used for the fixtures.
