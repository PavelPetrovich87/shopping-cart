import type { DomainEvent, EventHandler } from './DomainEvent';
import type { IEventBus } from './IEventBus';

/**
 * Concrete implementation of the Async Domain Event Bus.
 * Enables decoupled communication between bounded contexts.
 */
export class EventBus implements IEventBus {
    private registry: Map<string, Array<EventHandler<any>>> = new Map();

    /**
     * Subscribe a handler to a specific event name.
     * Returns an unsubscribe function.
     */
    public subscribe<T extends DomainEvent>(
        eventName: string,
        handler: EventHandler<T>
    ): () => void {
        const handlers = this.registry.get(eventName) || [];
        handlers.push(handler);
        this.registry.set(eventName, handlers);

        return () => {
            const currentHandlers = this.registry.get(eventName);
            if (currentHandlers) {
                this.registry.set(
                    eventName,
                    currentHandlers.filter((h) => h !== handler)
                );
            }
        };
    }

    /**
     * Publish an event asynchronously to all matching handlers.
     * Isolates errors so one failing handler does not disrupt others or the publisher.
     */
    public async publish(event: DomainEvent): Promise<void> {
        const handlers = this.registry.get(event.eventName);

        if (!handlers || handlers.length === 0) {
            return;
        }

        // Execute all handlers concurrently
        const executionPromises = handlers.map(async (handler) => {
            try {
                await handler(event);
            } catch (error) {
                // Isolated error logging to prevent process crash
                console.error(
                    `[EventBus] Error in handler for event "${event.eventName}":`,
                    error
                );
            }
        });

        // Fire all and wait for settlement
        await Promise.allSettled(executionPromises);
    }
}

/**
 * Singleton instance for global application use.
 */
export const eventBus = new EventBus();
