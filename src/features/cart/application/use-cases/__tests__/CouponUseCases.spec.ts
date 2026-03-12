import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyCouponToCart } from '../ApplyCouponToCart';
import { removeCouponFromCart } from '../RemoveCouponFromCart';
import { Cart } from '../../../domain/Cart';
import { ICartRepository } from '../../ports/ICartRepository';
import { IInventoryService } from '../../ports/IInventoryService';
import { IPricingService } from '../../ports/IPricingService';

describe('Coupon Use Cases', () => {
  let cart: Cart;
  let mockCartRepository: ICartRepository;
  let mockInventoryService: IInventoryService;
  let mockPricingService: IPricingService;

  const cartId = 'cart-123';
  const code = 'SAVE10';

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

  describe('applyCouponToCart', () => {
    it('should apply coupon when validation succeeds', async () => {
      vi.mocked(mockPricingService.validateCoupon).mockResolvedValue({
        success: true,
        value: { code }
      });

      const result = await applyCouponToCart(
        { cartId, code },
        { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.updatedCart.appliedCoupons).toContain(code);
      }
      expect(mockPricingService.validateCoupon).toHaveBeenCalledWith(code);
    });

    it('should return error when validation fails', async () => {
      vi.mocked(mockPricingService.validateCoupon).mockResolvedValue({
        success: false,
        error: 'INVALID_CODE'
      });

      const result = await applyCouponToCart(
        { cartId, code },
        { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('INVALID_CODE');
      }
      expect(cart.appliedCoupons).not.toContain(code);
    });
  });

  describe('removeCouponFromCart', () => {
    it('should remove coupon and return events', async () => {
      cart.applyCoupon(code);
      cart.pullEvents();

      const result = await removeCouponFromCart(
        { cartId, code },
        { cartRepository: mockCartRepository, inventoryService: mockInventoryService, pricingService: mockPricingService }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.updatedCart.appliedCoupons).not.toContain(code);
      }
    });
  });
});
