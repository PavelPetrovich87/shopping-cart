import { CartItem } from './CartItem';
import { CartState } from './CartState';
import type { DomainEvent } from '@/shared/events/DomainEvent';
import { Money } from '@/shared/domain/Money';
import type {
    ItemAddedToCart,
    CartItemQuantityChanged,
    ItemRemovedFromCart,
    CartCleared
} from './CartEvents';

/**
 * Aggregate Root for the Shopping Cart.
 * Manages the collection of items and the cart lifecycle state.
 */
export class Cart {
    public readonly id: string;
    public readonly items: Map<string, CartItem>;
    private _state: CartState;
    private _events: DomainEvent[] = [];
    public readonly createdAt: Date;
    public _updatedAt: Date;

    constructor(id: string) {
        this.id = id;
        this.items = new Map<string, CartItem>();
        this._state = CartState.Active;
        this.createdAt = new Date();
        this._updatedAt = new Date();
    }

    public get state(): CartState {
        return this._state;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }

    /**
     * Calculates the subtotal of all items in the cart.
     */
    public get subtotal(): Money {
        let total = Money.fromCents(0);
        for (const item of this.items.values()) {
            total = total.add(item.total());
        }
        return total;
    }

    /**
     * Adds an item to the cart or increments quantity if it already exists.
     */
    public addItem(skuId: string, quantity: number, price: Money): void {
        this.ensureActive();

        const existing = this.items.get(skuId);
        if (existing) {
            const newQuantity = existing.quantity + quantity;
            this.items.set(skuId, new CartItem(skuId, newQuantity, price));
            this.recordEvent({
                eventName: 'CartItemQuantityChanged',
                timestamp: Date.now(),
                payload: {
                    cartId: this.id,
                    skuId,
                    oldQuantity: existing.quantity,
                    newQuantity
                }
            } as CartItemQuantityChanged);
        } else {
            this.items.set(skuId, new CartItem(skuId, quantity, price));
            this.recordEvent({
                eventName: 'ItemAddedToCart',
                timestamp: Date.now(),
                payload: {
                    cartId: this.id,
                    skuId,
                    quantity,
                    price
                }
            } as ItemAddedToCart);
        }
        this.touch();
    }

    /**
     * Removes an item from the cart.
     */
    public removeItem(skuId: string): void {
        this.ensureActive();

        if (this.items.has(skuId)) {
            this.items.delete(skuId);
            this.recordEvent({
                eventName: 'ItemRemovedFromCart',
                timestamp: Date.now(),
                payload: {
                    cartId: this.id,
                    skuId
                }
            } as ItemRemovedFromCart);

            if (this.items.size === 0) {
                this.recordEvent({
                    eventName: 'CartCleared',
                    timestamp: Date.now(),
                    payload: {
                        cartId: this.id
                    }
                } as CartCleared);
            }
            this.touch();
        }
    }

    /**
     * Changes the quantity of an existing item.
     */
    public changeQuantity(skuId: string, newQuantity: number): void {
        this.ensureActive();

        const existing = this.items.get(skuId);
        if (!existing) {
            throw new Error(`CartItem not found: ${skuId}`);
        }

        if (newQuantity < 1) {
            throw new Error(`Quantity must be at least 1, received: ${newQuantity}`);
        }

        const oldQuantity = existing.quantity;
        if (oldQuantity === newQuantity) return;

        this.items.set(skuId, new CartItem(skuId, newQuantity, existing.priceAtAddition));
        this.recordEvent({
            eventName: 'CartItemQuantityChanged',
            timestamp: Date.now(),
            payload: {
                cartId: this.id,
                skuId,
                oldQuantity,
                newQuantity
            }
        } as CartItemQuantityChanged);
        this.touch();
    }

    /**
     * Transitions to Checkout_Pending state.
     */
    public initiateCheckout(): void {
        if (this._state !== CartState.Active) {
            throw new Error(`Cannot initiate checkout from state: ${this._state}`);
        }
        if (this.items.size === 0) {
            throw new Error('Cannot initiate checkout with an empty cart');
        }
        this._state = CartState.Checkout_Pending;
        this.touch();
    }

    /**
     * Transitions to Checked_Out state.
     */
    public markCheckedOut(): void {
        if (this._state !== CartState.Checkout_Pending) {
            throw new Error(`Cannot mark checked out from state: ${this._state}`);
        }
        this._state = CartState.Checked_Out;
        this.touch();
    }

    /**
     * Returns and clears the recorded domain events.
     */
    public pullEvents(): DomainEvent[] {
        const events = [...this._events];
        this._events = [];
        return events;
    }

    private recordEvent(event: DomainEvent): void {
        this._events.push(event);
    }

    private ensureActive(): void {
        if (this._state !== CartState.Active) {
            throw new Error(`Cannot modify cart in state: ${this._state}`);
        }
    }

    private touch(): void {
        this._updatedAt = new Date();
    }
}
