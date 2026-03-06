import type { DomainEvent, EventHandler } from './DomainEvent';

/**
 * Interface for the Domain Event Bus (Hexagonal Port).
 */
export interface IEventBus {
    /**
     * Subscribe a typed handler to an event by its name.
     * @returns A teardown function to unsubscribe the handler.
     */
    subscribe<T extends DomainEvent>(
        eventName: string,
        handler: EventHandler<T>
    ): () => void;

    /**
     * Publish an event to all registered handlers asynchronously.
     * Uses error isolation to ensure one handler failure doesn't block others.
     */
    publish(event: DomainEvent): Promise<void>;
}
