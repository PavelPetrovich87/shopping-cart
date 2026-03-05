---
work_package_id: WP02
title: Event Bus Verification
lane: "doing"
dependencies: []
base_branch: 002-async-domain-event-bus-WP01
base_commit: 2ae62faebd54439c2b8a76ea512c7f57ed3192e2
created_at: '2026-03-05T10:43:29.149857+00:00'
subtasks: [T007]
shell_pid: "2524"
agent: "Antigravity"
---

# WP02: Event Bus Verification

## Objective
Provide a robust test suite to verify the logic implemented in WP01. Focus on edge cases like handlers throwing errors, multiple subscribers, and asynchronous execution order.

## Context
Uses `src/shared/events/EventBus.ts`. Relies on Vitest for unit testing.

## Guidance

### Subtask T007: Implement comprehensive Vitest suite
- **Purpose**: Guarantee the Event Bus meets all functional requirements and success criteria.
- **Steps**:
  1. Create `src/shared/events/__tests__/EventBus.spec.ts`.
  2. **Test: Multi-Subscription**: Subscribe multiple handlers and verify all run on `publish`.
  3. **Test: Async Execution**: Verify `publish` returns after all handlers have been scheduled/executed, and handlers run asynchronously.
  4. **Test: Unsubscribe**: Subscribe, unsubscribe, and verify the handler no longer runs on `publish`.
  5. **Test: Error Isolation (CRITICAL)**:
     - Subscribe Handler A (throws error) and Handler B (succeeds).
     - Verify `publish` does not throw.
     - Verify both handlers were triggered.
     - Verify Handler B completed despite Handler A's failure.
  6. **Test: Typed Events**: Ensure generic types correctly enforce event shapes in the test file.
- **Files**: `src/shared/events/__tests__/EventBus.spec.ts`

## Definition of Done
- [ ] Multiple subscribers execute on a single event.
- [ ] `unsubscribe` prevents future handler execution.
- [ ] Event publishing is non-blocking (async).
- [ ] Handler failures are isolated and logged via `console.error`.
- [ ] 100% code coverage for `EventBus.ts`.

## Risks & Reviewer Guidance
- **Async Timing**: Use Vitest's `waitFor` or similar patterns if needed, though `Promise.allSettled` should make this straightforward.
- **Mocking**: You might need to mock `console.error` to verify error logging without polluting the test output.

## Next Steps
Run `spec-kitty implement WP02 --base WP01` to start.

## Activity Log

- 2026-03-05T10:43:29Z – Antigravity – shell_pid=2524 – lane=doing – Assigned agent via workflow command
