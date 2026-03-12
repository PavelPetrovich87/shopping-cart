import { Result } from '../../../src/shared/domain/Result';
import { Cart } from '../../../src/features/cart/domain/Cart';
import { DomainEvent } from '../../../src/shared/events/DomainEvent';
import { Money } from '../../../src/shared/domain/Money';
import { IInventoryService } from '../../../src/features/cart/application/ports/IInventoryService';
import { IPricingService } from '../../../src/features/cart/application/ports/IPricingService';

export type UseCaseResult = Result<{
    updatedCart: Cart;
    events: DomainEvent[];
}, string>;

export interface CartUseCaseDependencies {
    cartRepository: {
        findById(id: string): Promise<Cart | null>;
    };
    inventoryService: IInventoryService;
    pricingService: IPricingService;
}

/**
 * Add an item to the cart after checking stock.
 */
export type AddItemToCart = (
    params: { cartId: string; skuId: string; quantity: number; price: Money },
    deps: CartUseCaseDependencies
) => Promise<UseCaseResult>;

/**
 * Remove an item from the cart.
 */
export type RemoveItemFromCart = (
    params: { cartId: string; skuId: string },
    deps: CartUseCaseDependencies
) => Promise<UseCaseResult>;

/**
 * Change the quantity of a cart item after checking stock.
 */
export type ChangeCartItemQuantity = (
    params: { cartId: string; skuId: string; newQuantity: number },
    deps: CartUseCaseDependencies
) => Promise<UseCaseResult>;

/**
 * Apply a coupon code after validation.
 */
export type ApplyCouponToCart = (
    params: { cartId: string; code: string },
    deps: CartUseCaseDependencies
) => Promise<UseCaseResult>;

/**
 * Remove a coupon code.
 */
export type RemoveCouponFromCart = (
    params: { cartId: string; code: string },
    deps: CartUseCaseDependencies
) => Promise<UseCaseResult>;

/**
 * Initiate checkout after validating stock for all items.
 */
export type InitiateCheckout = (
    params: { cartId: string },
    deps: CartUseCaseDependencies
) => Promise<UseCaseResult>;
