---
work_package_id: WP04
title: Composition Root and Context Initialisation
lane: "done"
dependencies: [WP02, WP03]
base_branch: 009-pricing-ports-and-use-cases-WP04-merge-base
base_commit: 80c7a8dd54c3b6bc401684d887b18fdaf2b65436
created_at: '2026-03-12T14:33:46.633571+00:00'
subtasks: [T012, T013]
requirement_refs: [FR-01, FR-02, FR-03]
shell_pid: "81391"
agent: "gemini-cli"
reviewed_by: "PavelPetrovich87"
review_status: "approved"
---

# Work Package: WP04 - Composition Root and Context Initialisation

## Objective
Establish the composition root for the Pricing context following the project's Pure DI principles.

## Context
This work package wires the application logic (use cases) to the infrastructure (repositories). This creates a single point of initialization that can be accessed by other bounded contexts (like Cart).

## Technical Guidance

### Subtask T012: Create PricingContext.ts
**Purpose**: Centralize dependency injection for the Pricing context.
**Steps**:
1. Create directory `src/features/pricing/infrastructure/`.
2. Create `src/features/pricing/infrastructure/PricingContext.ts`.
3. Define a function or class to hold the initialized state.
4. Instantiate the repository (currently mocked as an in-memory instance).
5. Pass the repository to `createValidateCoupon` and `createCalculateDiscount`.
**Validation**:
- [ ] Initialized use cases correctly receive the same repository instance.

### Subtask T013: Export initialized context
**Purpose**: Provide an entry point for other contexts to interact with Pricing.
**Steps**:
1. Export the initialized use case functions from the Pricing context.
2. Consider implementing a pattern where a single `pricingContext` object is exported containing all use cases.
**Validation**:
- [ ] Successfully provides use cases to external callers.

## Definition of Done
- Pricing context is wired and ready for integration.
- Use cases are instantiated with correct dependencies.
- No heavy DI frameworks used, only pure TypeScript.

## Reviewer Guidance
Check for clear boundaries and minimal exposure of infrastructure details.
Confirm that the repository instance is correctly shared across use cases within the context.

## Activity Log

- 2026-03-12T14:33:47Z – gemini-cli – shell_pid=78661 – lane=doing – Assigned agent via workflow command
- 2026-03-12T14:56:54Z – gemini-cli – shell_pid=78661 – lane=for_review – Wired Pricing context with InMemoryCouponRepository and initialized use cases.
- 2026-03-12T14:57:01Z – gemini-cli – shell_pid=81391 – lane=doing – Started review via workflow command
- 2026-03-12T14:57:28Z – gemini-cli – shell_pid=81391 – lane=done – Review passed: Pricing context wired correctly with seed data and in-memory repository.
