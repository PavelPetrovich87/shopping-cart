/**
 * Base canonical shape for all events in the system.
 */
export interface DomainEvent {
    /**
     * Globally unique identifier for the event type (e.g., 'ItemAddedToCart').
     */
    readonly eventName: string;

    /**
     * Epoch timestamp indicating when the event occurred.
     */
    readonly timestamp: number;

    /**
     * Payload containing specific data related to the event.
     */
    readonly payload?: any;
}

/**
 * Signature for subscriber callbacks. 
 * Asynchronous function that receives a generic DomainEvent or specific implementation.
 */
export type EventHandler<T extends DomainEvent> = (event: T) => Promise<void> | void;
