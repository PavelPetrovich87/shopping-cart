import { StockReservation } from './StockReservation';
import type { DomainEvent } from '@/shared/events/DomainEvent';
import { Money } from '@/shared/domain/Money';
import type {
  StockReserved,
  StockDepleted,
  StockReleased,
} from './InventoryEvents';

/**
 * ProductVariant Aggregate Root
 * Manages physical stock levels, sales tracking, and temporary stock reservations.
 */
export class ProductVariant {
  public readonly id: string;
  public readonly basePrice: Money;
  private _totalOnHand: number;
  private _sold: number;
  private _version: number;
  private _reservations: StockReservation[];
  private _events: DomainEvent[] = [];

  public constructor(id: string, basePrice: Money, totalOnHand: number, sold: number = 0, version: number = 0) {
    if (totalOnHand < 0) {
      throw new Error(`ProductVariant totalOnHand cannot be negative: ${totalOnHand}`);
    }
    if (sold < 0) {
      throw new Error(`ProductVariant sold cannot be negative: ${sold}`);
    }
    this.id = id;
    this.basePrice = basePrice;
    this._totalOnHand = totalOnHand;
    this._sold = sold;
    this._version = version;
    this._reservations = [];
  }

  public get totalOnHand(): number {
    return this._totalOnHand;
  }

  public get sold(): number {
    return this._sold;
  }

  public get version(): number {
    return this._version;
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

  /**
   * Reserves a specific quantity of stock for an order if available.
   * 
   * @param orderId The identifier of the order.
   * @param qty The quantity to reserve.
   * @param ttl_ms The duration of the reservation in milliseconds.
   * @param now The current timestamp.
   */
  public reserve(orderId: string, qty: number, ttl_ms: number, now: Date): void {
    if (qty <= 0) {
      throw new Error(`Quantity must be greater than zero, received: ${qty}`);
    }

    const currentAvailability = this.availableStock(now);
    if (currentAvailability < qty) {
      throw new Error(`Insufficient stock for variant ${this.id}: requested ${qty}, available ${currentAvailability}`);
    }

    const expiresAt = new Date(now.getTime() + ttl_ms);
    const reservation = new StockReservation(orderId, qty, expiresAt);
    this._reservations.push(reservation);
    this._version++;

    this.recordEvent({
      eventName: 'StockReserved',
      timestamp: now.getTime(),
      payload: {
        skuId: this.id,
        orderId,
        quantity: qty,
        expiresAt,
      },
    } as StockReserved);
  }

  /**
   * Manually releases a stock reservation.
   * 
   * @param orderId The identifier of the order whose reservation should be released.
   */
  public releaseReservation(orderId: string): void {
    const resIndex = this._reservations.findIndex((r) => r.orderId === orderId);
    if (resIndex !== -1) {
      const reservation = this._reservations[resIndex];
      this._reservations.splice(resIndex, 1);
      this._version++;

      this.recordEvent({
        eventName: 'StockReleased',
        timestamp: Date.now(),
        payload: {
          skuId: this.id,
          orderId: reservation.orderId,
          quantity: reservation.quantity,
        },
      } as StockReleased);
    }
  }

  /**
   * Confirms that a reservation has been fulfilled by a sale,
   * permanently depleting the stock.
   * 
   * @param orderId The identifier of the order confirming the sale.
   */
  public confirmDepletion(orderId: string): void {
    const resIndex = this._reservations.findIndex((r) => r.orderId === orderId);
    if (resIndex === -1) {
      throw new Error(`Reservation not found for order ${orderId} on variant ${this.id}`);
    }

    const reservation = this._reservations[resIndex];
    if (this._totalOnHand < reservation.quantity) {
      // This should logically not happen if reservations are tracked correctly
      throw new Error(`Invariant violation: totalOnHand (${this._totalOnHand}) is less than reservation quantity (${reservation.quantity})`);
    }

    this._totalOnHand -= reservation.quantity;
    this._sold += reservation.quantity;
    this._reservations.splice(resIndex, 1);
    this._version++;

    this.recordEvent({
      eventName: 'StockDepleted',
      timestamp: Date.now(),
      payload: {
        skuId: this.id,
        orderId: reservation.orderId,
        quantity: reservation.quantity,
      },
    } as StockDepleted);
  }

  /**
   * Returns and clears the recorded domain events.
   */
  public pullEvents(): DomainEvent[] {
    const events = [...this._events];
    this._events = [];
    return events;
  }

  private recordEvent(event: DomainEvent): void {
    this._events.push(event);
  }
}
