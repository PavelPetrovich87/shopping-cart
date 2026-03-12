import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initiateCheckout } from '../InitiateCheckout';
import { Cart } from '../../../domain/Cart';
import { Money } from '@/shared/domain/Money';
import { CartState } from '../../../domain/CartState';
import { ICartRepository } from '../../ports/ICartRepository';
import { IInventoryService } from '../../ports/IInventoryService';
import { IPricingService } from '../../ports/IPricingService';

describe('InitiateCheckout Use Case', () => {
  let cart: Cart;
  let mockCartRepository: ICartRepository;
  let mockInventoryService: IInventoryService;
  let mockPricingService: IPricingService;

  const cartId = 'cart-123';
  const skuId1 = 'sku-1';
  const skuId2 = 'sku-2';
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

  it('should transition to Checkout_Pending when all items have stock', async () => {
    cart.addItem(skuId1, 1, price);
    cart.addItem(skuId2, 2, price);
    cart.pullEvents();

    vi.mocked(mockInventoryService.checkStockAvailability).mockResolvedValue({
      success: true,
      value: { available: true, currentStock: 10 }
    });

    const result = await initiateCheckout(
      { cartId },
      { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.updatedCart.state).toBe(CartState.Checkout_Pending);
    }
    expect(mockInventoryService.checkStockAvailability).toHaveBeenCalledTimes(2);
  });

  it('should return error when any item is out of stock', async () => {
    cart.addItem(skuId1, 1, price);
    cart.addItem(skuId2, 2, price);

    vi.mocked(mockInventoryService.checkStockAvailability)
      .mockResolvedValueOnce({ success: true, value: { available: true, currentStock: 10 } })
      .mockResolvedValueOnce({ success: true, value: { available: false, currentStock: 1 } });

    const result = await initiateCheckout(
      { cartId },
      { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('STOCK_UNAVAILABLE');
    }
    expect(cart.state).toBe(CartState.Active);
  });

  it('should return error for empty cart', async () => {
    const result = await initiateCheckout(
      { cartId },
      { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('empty cart');
    }
  });
});
