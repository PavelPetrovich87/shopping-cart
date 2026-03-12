import { Money } from '@/shared/domain/Money';
import { CartUseCaseDependencies, UseCaseResult } from './CartUseCaseTypes';

export interface AddItemParams {
  cartId: string;
  skuId: string;
  quantity: number;
  price: Money;
}

/**
 * Add an item to the cart after checking stock availability.
 */
export async function addItemToCart(
  params: AddItemParams,
  deps: CartUseCaseDependencies
): Promise<UseCaseResult> {
  const { cartId, skuId, quantity, price } = params;
  const { cartRepository, inventoryService } = deps;

  // 1. Fetch cart
  const cart = cartRepository.getCart(cartId);

  // 2. Check stock availability
  const stockResult = await inventoryService.checkStockAvailability(skuId, quantity);
  
  if (!stockResult.success || !stockResult.value.available) {
    return { success: false, error: 'OUT_OF_STOCK' };
  }

  // 3. Add item to aggregate
  cart.addItem(skuId, quantity, price);

  // 4. Return results (modified cart and domain events)
  return {
    success: true,
    value: {
      updatedCart: cart,
      events: cart.pullEvents()
    }
  };
}
