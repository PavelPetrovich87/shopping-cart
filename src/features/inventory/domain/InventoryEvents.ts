import type { DomainEvent } from '@/shared/events/DomainEvent';

/**
 * Emitted when stock is successfully reserved.
 */
export interface StockReserved extends DomainEvent {
    eventName: 'StockReserved';
    payload: {
        skuId: string;
        orderId: string;
        quantity: number;
        expiresAt: Date;
    };
}

/**
 * Emitted when stock is permanently depleted (after sale confirmation).
 */
export interface StockDepleted extends DomainEvent {
    eventName: 'StockDepleted';
    payload: {
        skuId: string;
        orderId: string;
        quantity: number;
    };
}

/**
 * Emitted when a reservation is released (expired or cancelled).
 */
export interface StockReleased extends DomainEvent {
    eventName: 'StockReleased';
    payload: {
        skuId: string;
        orderId: string;
        quantity: number;
    };
}
