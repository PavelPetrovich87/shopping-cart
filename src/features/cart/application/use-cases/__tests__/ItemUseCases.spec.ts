import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addItemToCart } from '../AddItemToCart';
import { removeItemFromCart } from '../RemoveItemFromCart';
import { changeCartItemQuantity } from '../ChangeCartItemQuantity';
import { Cart } from '../../../domain/Cart';
import { Money } from '@/shared/domain/Money';
import { ICartRepository } from '../../ports/ICartRepository';
import { IInventoryService } from '../../ports/IInventoryService';
import { IPricingService } from '../../ports/IPricingService';

describe('Item Use Cases', () => {
  let cart: Cart;
  let mockCartRepository: ICartRepository;
  let mockInventoryService: IInventoryService;
  let mockPricingService: IPricingService;

  const skuId = 'sku-123';
  const cartId = 'cart-123';
  const price = Money.fromPrice(10);

  beforeEach(() => {
    cart = new Cart(cartId);
    mockCartRepository = {
      getCart: vi.fn().mockReturnValue(cart),
      saveCart: vi.fn(),
    };
    mockInventoryService = {
      checkStockAvailability: vi.fn(),
    };
    mockPricingService = {
      validateCoupon: vi.fn(),
      calculateDiscount: vi.fn(),
    };
  });

  describe('addItemToCart', () => {
    it('should add item when stock is available', async () => {
      vi.mocked(mockInventoryService.checkStockAvailability).mockResolvedValue({
        success: true,
        value: { available: true, currentStock: 10 }
      });

      const result = await addItemToCart(
        { cartId, skuId, quantity: 2, price },
        { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.updatedCart.items.get(skuId)?.quantity).toBe(2);
        expect(result.value.events).toHaveLength(1);
        expect(result.value.events[0].eventName).toBe('ItemAddedToCart');
      }
      expect(mockInventoryService.checkStockAvailability).toHaveBeenCalledWith(skuId, 2);
    });

    it('should return error when stock is unavailable', async () => {
      vi.mocked(mockInventoryService.checkStockAvailability).mockResolvedValue({
        success: true,
        value: { available: false, currentStock: 1 }
      });

      const result = await addItemToCart(
        { cartId, skuId, quantity: 2, price },
        { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('OUT_OF_STOCK');
      }
      expect(cart.items.size).toBe(0);
    });
  });

  describe('removeItemFromCart', () => {
    it('should remove item and return events', async () => {
      cart.addItem(skuId, 1, price);
      cart.pullEvents(); // Clear events

      const result = await removeItemFromCart(
        { cartId, skuId },
        { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.updatedCart.items.has(skuId)).toBe(false);
        expect(result.value.events.some(e => e.eventName === 'ItemRemovedFromCart')).toBe(true);
      }
    });
  });

  describe('changeCartItemQuantity', () => {
    it('should change quantity when stock is available', async () => {
      cart.addItem(skuId, 1, price);
      cart.pullEvents();

      vi.mocked(mockInventoryService.checkStockAvailability).mockResolvedValue({
        success: true,
        value: { available: true, currentStock: 10 }
      });

      const result = await changeCartItemQuantity(
        { cartId, skuId, newQuantity: 5 },
        { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.updatedCart.items.get(skuId)?.quantity).toBe(5);
        expect(result.value.events[0].eventName).toBe('CartItemQuantityChanged');
      }
    });

    it('should return error if item not in cart', async () => {
      const result = await changeCartItemQuantity(
        { cartId, skuId: 'unknown', newQuantity: 5 },
        { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('CartItem not found');
      }
    });

    it('should return error if stock check fails for new quantity', async () => {
      cart.addItem(skuId, 1, price);
      cart.pullEvents();

      vi.mocked(mockInventoryService.checkStockAvailability).mockResolvedValue({
        success: true,
        value: { available: false, currentStock: 2 }
      });

      const result = await changeCartItemQuantity(
        { cartId, skuId, newQuantity: 5 },
        { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('OUT_OF_STOCK');
      }
      expect(cart.items.get(skuId)?.quantity).toBe(1);
    });
  });
});
