import { Money } from '@/shared/domain/Money';

/**
 * Domain entity representing a product selection in the Cart.
 */
export class CartItem {
    public readonly skuId: string;
    public readonly quantity: number;
    public readonly priceAtAddition: Money;

    constructor(skuId: string, quantity: number, priceAtAddition: Money) {
        if (quantity < 1) {
            throw new Error(`CartItem quantity must be at least 1, received: ${quantity}`);
        }
        this.skuId = skuId;
        this.quantity = quantity;
        this.priceAtAddition = priceAtAddition;
    }

    /**
     * Calculates the total value of this item selection.
     */
    public total(): Money {
        return this.priceAtAddition.multiply(this.quantity);
    }
}
