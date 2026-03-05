---
work_package_id: WP01
title: Event Bus Core Implementation
lane: "doing"
dependencies: []
base_branch: main
base_commit: b1fbc2b6aa02a2fa04c18872ce471038373eb547
created_at: '2026-03-05T10:41:03.291052+00:00'
subtasks: [T001, T002, T003, T004, T005, T006]
shell_pid: "804"
---

# WP01: Event Bus Core Implementation

## Objective
Implement a custom, asynchronous Pub/Sub domain event bus to enable decouple cross-context communication. Focus on type safety, immutability of the implementation, and robust error handling.

## Context
This is a foundational infrastructure component located in `src/shared/events/`. Other bounded contexts like Cart and Inventory will use this to broadcast state changes.

## Guidance

### Subtask T001: Define `DomainEvent` and `EventHandler` types
- **Purpose**: Create the base contracts for all events and their handlers.
- **Steps**:
  1. Create `src/shared/events/DomainEvent.ts`.
  2. Define `DomainEvent` interface: `eventName: string`, `timestamp: number`, `payload?: any`.
  3. Define `EventHandler<T extends DomainEvent>` type: `(event: T) => Promise<void> | void`.
- **Files**: `src/shared/events/DomainEvent.ts`

### Subtask T002: Define `IEventBus` interface
- **Purpose**: Formalize the Event Bus contract for dependency inversion.
- **Steps**:
  1. Create `src/shared/events/IEventBus.ts`.
  2. Define `IEventBus` interface:
     - `subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): () => void`
     - `publish(event: DomainEvent): Promise<void>`
- **Files**: `src/shared/events/IEventBus.ts`

### Subtask T003: Implement `EventBus` class structure
- **Purpose**: Create the registry for handlers.
- **Steps**:
  1. Create `src/shared/events/EventBus.ts`.
  2. Implement `IEventBus`.
  3. Add a private `registry` property: `Map<string, Array<EventHandler<any>>>`.
- **Files**: `src/shared/events/EventBus.ts`

### Subtask T004: Implement `subscribe` and `unsubscribe`
- **Purpose**: Allow dynamic registration of handlers with safe cleanup.
- **Steps**:
  1. Implement `subscribe`: Add the handler to the array for the given `eventName`.
  2. Return a teardown function that filters out the EXACT handler instance from the array.
- **Note**: Ensure the array exists in the map before pushing.

### Subtask T005: Implement async `publish` with error isolation
- **Purpose**: Broadcast events to all registered handlers without crashing on failures.
- **Steps**:
  1. Implement `publish`: Get all handlers for the event name.
  2. If no handlers, just resolve.
  3. Map handlers to execution promises.
  4. Use `Promise.allSettled(executionPromises)` to run handlers concurrently.
  5. Log any rejected results (errors) to `console.error` but don't rethrow.
- **Performance**: Ensure handlers are truly async (don't block the publisher).

### Subtask T006: Export `eventBus` singleton
- **Purpose**: Provide a single access point for the application.
- **Steps**:
  1. Instantiate `EventBus` at the bottom of `EventBus.ts`.
  2. Export it as `eventBus`.

## Definition of Done
- [ ] `DomainEvent` and `EventHandler` types defined.
- [ ] `IEventBus` interface implemented by `EventBus` class.
- [ ] `subscribe` returns a working `unsubscribe` function.
- [ ] `publish` executes multiple handlers asynchronously.
- [ ] Event handler errors are caught and logged, not blocking other handlers.
- [ ] The `eventBus` singleton is exported.

## Risks & Reviewer Guidance
- **Memory Leaks**: Verify that `unsubscribe` correctly removes the handler from the array.
- **Error Isolation**: Ensure `Promise.allSettled` is used correctly to safeguard against crashing handlers.

## Next Steps
Run `spec-kitty implement WP01` to start.
