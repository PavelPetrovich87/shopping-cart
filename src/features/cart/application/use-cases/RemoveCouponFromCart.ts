import { CartUseCaseDependencies, UseCaseResult } from './CartUseCaseTypes';

export interface RemoveCouponParams {
  cartId: string;
  code: string;
}

/**
 * Remove an applied coupon code from the cart.
 */
export async function removeCouponFromCart(
  params: RemoveCouponParams,
  deps: CartUseCaseDependencies
): Promise<UseCaseResult> {
  const { cartId, code } = params;
  const { cartRepository } = deps;

  // 1. Fetch cart
  const cart = cartRepository.getCart(cartId);

  // 2. Remove coupon from aggregate
  cart.removeCoupon(code);

  // 3. Return results
  return {
    success: true,
    value: {
      updatedCart: cart,
      events: cart.pullEvents()
    }
  };
}
