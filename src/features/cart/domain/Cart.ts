import { CartItem } from './CartItem';
import { CartState } from './CartState';

/**
 * Aggregate Root for the Shopping Cart.
 * Manages the collection of items and the cart lifecycle state.
 */
export class Cart {
    public readonly id: string;
    public readonly items: Map<string, CartItem>;
    private _state: CartState;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(id: string) {
        this.id = id;
        this.items = new Map<string, CartItem>();
        this._state = CartState.Active;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public get state(): CartState {
        return this._state;
    }
}
