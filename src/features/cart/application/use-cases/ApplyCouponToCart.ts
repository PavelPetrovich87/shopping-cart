import { CartUseCaseDependencies, UseCaseResult } from './CartUseCaseTypes';

export interface ApplyCouponParams {
  cartId: string;
  code: string;
}

/**
 * Apply a coupon code to the cart after validating it with the pricing service.
 */
export async function applyCouponToCart(
  params: ApplyCouponParams,
  deps: CartUseCaseDependencies
): Promise<UseCaseResult> {
  const { cartId, code } = params;
  const { cartRepository, pricingService } = deps;

  // 1. Fetch cart
  const cart = cartRepository.getCart(cartId);

  // 2. Validate coupon
  const validationResult = await pricingService.validateCoupon(code);
  
  if (!validationResult.success) {
    return { success: false, error: validationResult.error };
  }

  // 3. Apply coupon to aggregate
  cart.applyCoupon(code);

  // 4. Return results
  return {
    success: true,
    value: {
      updatedCart: cart,
      events: cart.pullEvents()
    }
  };
}
