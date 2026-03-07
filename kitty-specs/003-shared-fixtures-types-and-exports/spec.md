# Feature Specification: Shared Fixtures from data/

## User Stories
As a developer, I want to access raw data from `data/` in a type-safe manner so that I can build mock repositories and tests without manual casting or risk of runtime errors.

## Functional Requirements

- [ ] `FR-001`: Define `*Record` interfaces mirroring the JSON structure of project data files.
- [ ] `FR-002`: Use snake_case for record properties to match JSON keys exactly.
- [ ] `FR-003`: Provide centralized exports for each data file as typed constants.
- [ ] `FR-004`: Ensure all date fields are typed as `string` (ISO-8601).

## Success Criteria
- [ ] All 7 core data files (products, inventory, coupons, etc.) are exported with correct types.
- [ ] IDE autocomplete works for all exported fixture data.
- [ ] `npx tsc --noEmit` passes with 0 errors in the fixtures module.
