import { CartUseCaseDependencies, UseCaseResult } from './CartUseCaseTypes';

export interface InitiateCheckoutParams {
  cartId: string;
}

/**
 * Initiate checkout for the cart.
 * Validates stock for all items in the cart before transitioning to Checkout_Pending state.
 */
export async function initiateCheckout(
  params: InitiateCheckoutParams,
  deps: CartUseCaseDependencies
): Promise<UseCaseResult> {
  const { cartId } = params;
  const { cartRepository, inventoryService } = deps;

  // 1. Fetch cart
  const cart = cartRepository.getCart(cartId);

  // 2. Validate stock for ALL items
  const items = Array.from(cart.items.values());
  
  if (items.length === 0) {
    return { success: false, error: 'Cannot initiate checkout with an empty cart' };
  }

  for (const item of items) {
    const stockResult = await inventoryService.checkStockAvailability(item.skuId, item.quantity);
    if (!stockResult.success || !stockResult.value.available) {
      return { success: false, error: `STOCK_UNAVAILABLE: ${item.skuId}` };
    }
  }

  // 3. Initiate checkout in aggregate
  try {
    cart.initiateCheckout();
  } catch (error: any) {
    return { success: false, error: error.message || 'UNKNOWN_ERROR' };
  }

  // 4. Return results
  return {
    success: true,
    value: {
      updatedCart: cart,
      events: cart.pullEvents()
    }
  };
}
