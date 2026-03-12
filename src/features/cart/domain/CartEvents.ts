import type { DomainEvent } from '@/shared/events/DomainEvent';
import { Money } from '@/shared/domain/Money';

export interface ItemAddedToCart extends DomainEvent {
    eventName: 'ItemAddedToCart';
    payload: {
        cartId: string;
        skuId: string;
        quantity: number;
        price: Money;
    };
}

export interface CartItemQuantityChanged extends DomainEvent {
    eventName: 'CartItemQuantityChanged';
    payload: {
        cartId: string;
        skuId: string;
        oldQuantity: number;
        newQuantity: number;
    };
}

export interface ItemRemovedFromCart extends DomainEvent {
    eventName: 'ItemRemovedFromCart';
    payload: {
        cartId: string;
        skuId: string;
    };
}

export interface CartCleared extends DomainEvent {
    eventName: 'CartCleared';
    payload: {
        cartId: string;
    };
}

export interface CouponAppliedToCart extends DomainEvent {
    eventName: 'CouponAppliedToCart';
    payload: {
        cartId: string;
        code: string;
        discountAmount?: Money;
        discountPercentage?: number;
    };
}

export interface CouponRemovedFromCart extends DomainEvent {
    eventName: 'CouponRemovedFromCart';
    payload: {
        cartId: string;
        code: string;
    };
}

export interface CheckoutInitiated extends DomainEvent {
    eventName: 'CheckoutInitiated';
    payload: {
        cartId: string;
        items: { skuId: string; quantity: number }[];
        subtotal: Money;
    };
}
