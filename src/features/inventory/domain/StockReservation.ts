/**
 * StockReservation Value Object
 * Represents a temporary hold on physical stock for a specific order.
 * Immutable: Attributes cannot be changed after creation.
 */
export class StockReservation {
  private readonly _orderId: string;
  private readonly _quantity: number;
  private readonly _expiresAt: Date;

  public constructor(orderId: string, quantity: number, expiresAt: Date) {
    if (quantity <= 0) {
      throw new Error(`StockReservation quantity must be greater than zero: ${quantity}`);
    }
    this._orderId = orderId;
    this._quantity = quantity;
    this._expiresAt = new Date(expiresAt.getTime()); // Defensive copy
  }

  public get orderId(): string {
    return this._orderId;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public get expiresAt(): Date {
    return new Date(this._expiresAt.getTime()); // Defensive copy
  }

  /**
   * Equality check
   */
  public equals(other: StockReservation): boolean {
    return (
      this._orderId === other.orderId &&
      this._quantity === other.quantity &&
      this._expiresAt.getTime() === other.expiresAt.getTime()
    );
  }
}
