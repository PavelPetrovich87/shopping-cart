import { CartUseCaseDependencies, UseCaseResult } from './CartUseCaseTypes';

export interface RemoveItemParams {
  cartId: string;
  skuId: string;
}

/**
 * Remove an item from the cart.
 */
export async function removeItemFromCart(
  params: RemoveItemParams,
  deps: CartUseCaseDependencies
): Promise<UseCaseResult> {
  const { cartId, skuId } = params;
  const { cartRepository } = deps;

  // 1. Fetch cart
  const cart = cartRepository.getCart(cartId);

  // 2. Remove item from aggregate
  cart.removeItem(skuId);

  // 3. Return results
  return {
    success: true,
    value: {
      updatedCart: cart,
      events: cart.pullEvents()
    }
  };
}
