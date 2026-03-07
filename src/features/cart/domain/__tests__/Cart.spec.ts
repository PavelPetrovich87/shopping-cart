import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Cart } from '../Cart';
import { Money } from '@/shared/domain/Money';
import { CartState } from '../CartState';
import {
    ItemAddedToCart,
    CartItemQuantityChanged,
    ItemRemovedFromCart,
    CartCleared
} from '../CartEvents';

describe('Cart', () => {
    let cart: Cart;
    const mockPrice = Money.fromPrice(10); // $10.00
    const skuId = 'sku-123';

    beforeEach(() => {
        cart = new Cart('cart-123');
    });

    it('should initialize with Active state and empty items', () => {
        expect(cart.id).toBe('cart-123');
        expect(cart.state).toBe(CartState.Active);
        expect(cart.items.size).toBe(0);
        expect(cart.subtotal.rawCents).toBe(0);
    });

    describe('addItem', () => {
        it('should add a new item and record ItemAddedToCart event', () => {
            cart.addItem(skuId, 2, mockPrice);

            expect(cart.items.size).toBe(1);
            const item = cart.items.get(skuId);
            expect(item?.quantity).toBe(2);
            expect(cart.subtotal.rawCents).toBe(2000);

            const events = cart.pullEvents();
            expect(events).toHaveLength(1);
            expect(events[0].eventName).toBe('ItemAddedToCart');
            const event = events[0] as ItemAddedToCart;
            expect(event.payload.skuId).toBe(skuId);
            expect(event.payload.quantity).toBe(2);
        });

        it('should increment quantity for existing item and record CartItemQuantityChanged', () => {
            cart.addItem(skuId, 2, mockPrice);
            cart.pullEvents(); // Clear initial event

            cart.addItem(skuId, 3, mockPrice);

            expect(cart.items.get(skuId)?.quantity).toBe(5);
            expect(cart.subtotal.rawCents).toBe(5000);

            const events = cart.pullEvents();
            expect(events).toHaveLength(1);
            expect(events[0].eventName).toBe('CartItemQuantityChanged');
            const event = events[0] as CartItemQuantityChanged;
            expect(event.payload.oldQuantity).toBe(2);
            expect(event.payload.newQuantity).toBe(5);
        });
    });

    describe('removeItem', () => {
        it('should remove item and record ItemRemovedFromCart and CartCleared if empty', () => {
            cart.addItem(skuId, 1, mockPrice);
            cart.pullEvents();

            cart.removeItem(skuId);

            expect(cart.items.size).toBe(0);

            const events = cart.pullEvents();
            expect(events).toHaveLength(2);
            expect(events[0].eventName).toBe('ItemRemovedFromCart');
            expect(events[1].eventName).toBe('CartCleared');
        });
    });

    describe('changeQuantity', () => {
        it('should change quantity and record CartItemQuantityChanged', () => {
            cart.addItem(skuId, 2, mockPrice);
            cart.pullEvents();

            cart.changeQuantity(skuId, 10);

            expect(cart.items.get(skuId)?.quantity).toBe(10);

            const events = cart.pullEvents();
            expect(events).toHaveLength(1);
            expect(events[0].eventName).toBe('CartItemQuantityChanged');
            const event = events[0] as CartItemQuantityChanged;
            expect(event.payload.newQuantity).toBe(10);
        });

        it('should throw if item not found', () => {
            expect(() => cart.changeQuantity('unknown', 5)).toThrow('CartItem not found');
        });

        it('should throw if new quantity is less than 1', () => {
            cart.addItem(skuId, 1, mockPrice);
            expect(() => cart.changeQuantity(skuId, 0)).toThrow('Quantity must be at least 1');
        });
    });

    describe('State Transitions', () => {
        it('should transition to Checkout_Pending', () => {
            cart.addItem(skuId, 1, mockPrice);
            cart.initiateCheckout();
            expect(cart.state).toBe(CartState.Checkout_Pending);
        });

        it('should throw when initiating checkout on empty cart', () => {
            expect(() => cart.initiateCheckout()).toThrow('Cannot initiate checkout with an empty cart');
        });

        it('should transition to Checked_Out', () => {
            cart.addItem(skuId, 1, mockPrice);
            cart.initiateCheckout();
            cart.markCheckedOut();
            expect(cart.state).toBe(CartState.Checked_Out);
        });

        it('should guard mutations when not Active', () => {
            cart.addItem(skuId, 1, mockPrice);
            cart.initiateCheckout();

            expect(() => cart.addItem('sku2', 1, mockPrice)).toThrow('Cannot modify cart in state: Checkout_Pending');
            expect(() => cart.removeItem(skuId)).toThrow('Cannot modify cart in state: Checkout_Pending');
            expect(() => cart.changeQuantity(skuId, 2)).toThrow('Cannot modify cart in state: Checkout_Pending');
        });
    });
});
