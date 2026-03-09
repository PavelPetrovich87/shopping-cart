import { DomainEvent } from '@/shared/events/DomainEvent';
import { Money } from '@/shared/domain/Money';

export interface CouponValidatedDomainEvent extends DomainEvent {
  readonly eventName: 'CouponValidated';
  readonly payload: {
    readonly code: string;
  };
}

export interface CouponValidationFailedDomainEvent extends DomainEvent {
  readonly eventName: 'CouponValidationFailed';
  readonly payload: {
    readonly code: string;
    readonly error: string;
  };
}

export interface DiscountCalculatedDomainEvent extends DomainEvent {
  readonly eventName: 'DiscountCalculated';
  readonly payload: {
    readonly code: string;
    readonly subtotalCents: number;
    readonly discountCents: number;
  };
}

export const createCouponValidatedEvent = (code: string): CouponValidatedDomainEvent => ({
  eventName: 'CouponValidated',
  timestamp: Date.now(),
  payload: { code },
});

export const createCouponValidationFailedEvent = (code: string, error: string): CouponValidationFailedDomainEvent => ({
  eventName: 'CouponValidationFailed',
  timestamp: Date.now(),
  payload: { code, error },
});

export const createDiscountCalculatedEvent = (code: string, subtotal: Money, discount: Money): DiscountCalculatedDomainEvent => ({
  eventName: 'DiscountCalculated',
  timestamp: Date.now(),
  payload: {
    code,
    subtotalCents: subtotal.rawCents,
    discountCents: discount.rawCents,
  },
});
