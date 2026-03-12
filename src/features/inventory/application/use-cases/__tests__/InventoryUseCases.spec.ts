import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CheckStockAvailability } from '../CheckStockAvailability';
import { ReserveStock } from '../ReserveStock';
import { ReleaseStockReservation } from '../ReleaseStockReservation';
import { ConfirmStockDepletion } from '../ConfirmStockDepletion';
import { IStockRepository } from '../../ports/IStockRepository';
import { IEventBus } from '@/shared/events/IEventBus';
import { ProductVariant } from '../../../domain/ProductVariant';
import { Money } from '@/shared/domain/Money';

describe('Inventory Use Cases', () => {
  let repository: IStockRepository;
  let eventBus: IEventBus;
  let variant: ProductVariant;

  beforeEach(() => {
    variant = new ProductVariant('sku-123', Money.fromPrice(10), 100);
    
    repository = {
      findBySku: vi.fn().mockResolvedValue(variant),
      save: vi.fn().mockResolvedValue(undefined),
    };

    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(),
    };
  });

  describe('CheckStockAvailability', () => {
    it('should return availability and current stock', async () => {
      const useCase = new CheckStockAvailability(repository);
      const result = await useCase.execute('sku-123', 10);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.available).toBe(true);
        expect(result.value.currentStock).toBe(100);
      }
    });

    it('should return VARIANT_NOT_FOUND if variant does not exist', async () => {
      vi.mocked(repository.findBySku).mockResolvedValue(null);
      const useCase = new CheckStockAvailability(repository);
      const result = await useCase.execute('unknown', 10);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('VARIANT_NOT_FOUND');
      }
    });
  });

  describe('ReserveStock', () => {
    it('should reserve stock and publish events', async () => {
      const useCase = new ReserveStock(repository, eventBus);
      const result = await useCase.execute('sku-123', 'order-1', 10);

      expect(result.success).toBe(true);
      expect(repository.save).toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalled();
    });

    it('should return OUT_OF_STOCK if insufficient stock', async () => {
      const useCase = new ReserveStock(repository, eventBus);
      const result = await useCase.execute('sku-123', 'order-1', 101);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('OUT_OF_STOCK');
      }
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('ReleaseStockReservation', () => {
    it('should release reservation and publish events', async () => {
      const useCase = new ReleaseStockReservation(repository, eventBus);
      
      // Setup a reservation first
      variant.reserve('order-1', 10, 60000, new Date());
      variant.pullEvents(); // Clear reserve event

      const result = await useCase.execute('sku-123', 'order-1');

      expect(result.success).toBe(true);
      expect(repository.save).toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalled();
    });

    it('should return VARIANT_NOT_FOUND if variant does not exist', async () => {
      vi.mocked(repository.findBySku).mockResolvedValue(null);
      const useCase = new ReleaseStockReservation(repository, eventBus);
      const result = await useCase.execute('unknown', 'order-1');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('VARIANT_NOT_FOUND');
      }
    });
  });

  describe('ConfirmStockDepletion', () => {
    it('should confirm depletion and publish events', async () => {
      const useCase = new ConfirmStockDepletion(repository, eventBus);
      
      // Setup a reservation first
      variant.reserve('order-1', 10, 60000, new Date());
      variant.pullEvents(); // Clear reserve event

      const result = await useCase.execute('sku-123', 'order-1');

      expect(result.success).toBe(true);
      expect(repository.save).toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalled();
    });

    it('should return RESERVATION_NOT_FOUND if reservation does not exist', async () => {
      const useCase = new ConfirmStockDepletion(repository, eventBus);
      const result = await useCase.execute('sku-123', 'unknown-order');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('RESERVATION_NOT_FOUND');
      }
    });
  });
});
