# API Contracts: Event Bus

## `IEventBus.ts`
The driving port/contract for the synchronous pub/sub implementation.

```typescript
// src/shared/events/IEventBus.ts

export interface DomainEvent {
  eventName: string;
  timestamp: number;
}

export type EventHandler<T extends DomainEvent> = (event: T) => Promise<void> | void;

export interface Unsubscribe {
  (): void;
}

export interface IEventBus {
  /**
   * Registers a handler for a specific domain event.
   *
   * @param eventName - The unique string identifier for the event.
   * @param handler - The asynchronous callback function.
   * @returns An unsubscribe function to remove the handler safely without memory leaks.
   */
  subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): Unsubscribe;

  /**
   * Dispatches the domain event to all registered subscribers.
   * Handlers run asynchronously, and errors are caught securely.
   *
   * @param event - The fully populated domain event instance matching the specified typing.
   */
  publish<T extends DomainEvent>(event: T): Promise<void>;
}
```
