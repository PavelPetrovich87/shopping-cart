import { Money } from '@/shared/domain/Money';
import { CouponResult, MoneyResult } from '@/features/cart/domain/PricingResults';

/**
 * Driven port interface for communicating with the Pricing domain context.
 */
export interface IPricingService {
  /**
   * Validates if a coupon code is applicable.
   * @param code The coupon code.
   * @returns A promise resolving to a CouponResult (success or domain error).
   */
  validateCoupon(code: string): Promise<CouponResult>;

  /**
   * Calculates the discount amount for a given code and subtotal.
   * @param code The coupon code.
   * @param subtotal The current subtotal of the cart as a Money value object.
   * @returns A promise resolving to a MoneyResult containing the calculated discount (or error).
   */
  calculateDiscount(code: string, subtotal: Money): Promise<MoneyResult>;
}
