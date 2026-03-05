# Data Model: Async Domain Event Bus

## Overview
The Event Bus does not persist data to a database. Its "data model" consists entirely of in-memory data structures required to map event types to their corresponding asynchronous handlers.

## Core Entities

### 1. DomainEvent (Interface)
The canonical shape for all events in the system.

**Description:** Base contract for all events dispatched through the bus.
**Fields:**
- `eventName: string` - Globally unique identifier for the event type (e.g., `'ItemAddedToCart'`).
- `timestamp: number` - Epoch timestamp indicating when the event occurred.
- `payload: any` - (Optional) Payload containing the specific data related to the event.

### 2. EventHandler (Type)
The signature for subscriber callbacks.

**Description:** An asynchronous function that receives a generic `DomainEvent` or specific implementation.
**Signature:** `(event: T) => Promise<void> | void`

### 3. EventRegistry (Internal State Map)
The internal state holding subscriptions.

**Description:** Maps an event name/type to an array of registered handler functions.
**Structure:** `Map<string, Array<EventHandler<any>>>`
**Lifecycle:**
- Initialized empty on EventBus instantiation.
- Mutated upon `subscribe()` (handler added) and the corresponding `unsubscribe()` (handler removed via array filtering).

## State Transitions
While the event bus is largely stateless apart from subscriptions, the process of executing handlers has a minor state flow:
1. **Registered:** A handler is added to the Map.
2. **Scheduled:** When `publish` is called, all associated handlers for that typing are loaded from the Map.
3. **Executing:** Handlers are executed concurrently using `Promise.allSettled`.
4. **Resolved/Failed:** Failed executions are caught and logged; resolved ones complete silently.
