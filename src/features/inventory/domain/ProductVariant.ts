import { StockReservation } from './StockReservation';

/**
 * ProductVariant Aggregate Root
 * Manages physical stock levels, sales tracking, and temporary stock reservations.
 */
export class ProductVariant {
  public readonly id: string;
  private _totalOnHand: number;
  private _sold: number;
  private _reservations: StockReservation[];

  public constructor(id: string, totalOnHand: number, sold: number = 0) {
    if (totalOnHand < 0) {
      throw new Error(`ProductVariant totalOnHand cannot be negative: ${totalOnHand}`);
    }
    if (sold < 0) {
      throw new Error(`ProductVariant sold cannot be negative: ${sold}`);
    }
    this.id = id;
    this._totalOnHand = totalOnHand;
    this._sold = sold;
    this._reservations = [];
  }

  public get totalOnHand(): number {
    return this._totalOnHand;
  }

  public get sold(): number {
    return this._sold;
  }

  public get reservations(): StockReservation[] {
    return [...this._reservations];
  }

  /**
   * Calculates the currently available stock.
   * Available stock = totalOnHand - sum(active reservations).
   * A reservation is active if its expiry date is in the future.
   * 
   * @param now The current timestamp to check reservations against.
   */
  public availableStock(now: Date): number {
    const activeReservationsSum = this._reservations
      .filter((res) => res.expiresAt.getTime() > now.getTime())
      .reduce((sum, res) => sum + res.quantity, 0);

    return Math.max(0, this._totalOnHand - activeReservationsSum);
  }
}
