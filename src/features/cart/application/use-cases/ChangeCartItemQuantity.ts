import { CartUseCaseDependencies, UseCaseResult } from './CartUseCaseTypes';

export interface ChangeQuantityParams {
  cartId: string;
  skuId: string;
  newQuantity: number;
}

/**
 * Update the quantity of an existing cart item after checking stock availability.
 */
export async function changeCartItemQuantity(
  params: ChangeQuantityParams,
  deps: CartUseCaseDependencies
): Promise<UseCaseResult> {
  const { cartId, skuId, newQuantity } = params;
  const { cartRepository, inventoryService } = deps;

  // 1. Fetch cart
  const cart = cartRepository.getCart(cartId);

  // 2. Verify existence of item in cart (domain invariant)
  if (!cart.items.has(skuId)) {
    return { success: false, error: `CartItem not found: ${skuId}` };
  }

  // 3. Check stock availability for the NEW quantity
  const stockResult = await inventoryService.checkStockAvailability(skuId, newQuantity);
  
  if (!stockResult.success || !stockResult.value.available) {
    return { success: false, error: 'OUT_OF_STOCK' };
  }

  // 4. Update quantity in aggregate
  try {
    cart.changeQuantity(skuId, newQuantity);
  } catch (error: any) {
    return { success: false, error: error.message || 'UNKNOWN_ERROR' };
  }

  // 5. Return results
  return {
    success: true,
    value: {
      updatedCart: cart,
      events: cart.pullEvents()
    }
  };
}
