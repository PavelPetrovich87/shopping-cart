# Quickstart: Async Domain Event Bus

## Purpose
The Async Domain Event Bus facilitates cross-context communication in a decoupled manner. It replaces tight method coupling with simple Pub/Sub channels. Use this when one module (such as Inventory) needs to react to an event originating in another module (such as Cart) without the Cart knowing about the Inventory.

## Registration/Export Location
`src/shared/events/EventBus.ts`
*(Provides standard singleton/instantiation pattern)*

## Usage Guide

### Defining an Event
Create an interface mapping to your event payload:

```typescript
import { DomainEvent } from '@/shared/events/IEventBus';

export interface ItemAddedToCart extends DomainEvent {
  eventName: 'ItemAddedToCart';
  skuId: string;
  quantity: number;
}
```

### Subscribing to an Event
Components (or adapters) can initialize reactive behaviors when an event resolves:

```typescript
import { eventBus } from '@/shared/events/EventBus';
import { ItemAddedToCart } from '@/features/cart/domain/CartEvents';

const unsubscribe = eventBus.subscribe<ItemAddedToCart>('ItemAddedToCart', async (event) => {
  // Safe, decoupled execution:
  console.log(`Reacting to ${event.skuId} being collected`);
  await reserveStockForCartItem(event.skuId, event.quantity);
});

// ALWAYS call unsubscribe when the React component/context unmounts
// eg: return () => unsubscribe();
```

### Publishing an Event
Aggregates or Service Use Cases issue broadcasts:

```typescript
import { eventBus } from '@/shared/events/EventBus';

await eventBus.publish({
  eventName: 'ItemAddedToCart',
  timestamp: Date.now(),
  skuId: 'SKU-001',
  quantity: 2
});

```

## Troubleshooting
**"Why isn't my react hook seeing this event?"**
Ensure you aren't subscribing inside a React standard pure-render loop and actually placing it inside an effect:
```typescript
useEffect(() => {
   return eventBus.subscribe<SomeEvent>('SomeEvent', handler);
}, [])
```

**"The other handler crashed, will my handler run?"**
Yes. All subscribed handler promises hit a `Promise.allSettled`, which executes them concurrently and safely isolates rejected promises.
