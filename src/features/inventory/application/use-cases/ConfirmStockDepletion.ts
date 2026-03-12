import { Result } from '@/shared/domain/Result';
import { IStockRepository } from '../ports/IStockRepository';
import { IEventBus } from '@/shared/events/IEventBus';

export class ConfirmStockDepletion {
  constructor(
    private readonly repository: IStockRepository,
    private readonly eventBus: IEventBus
  ) {}

  async execute(skuId: string, orderId: string): Promise<Result<void, 'VARIANT_NOT_FOUND' | 'RESERVATION_NOT_FOUND'>> {
    const variant = await this.repository.findBySku(skuId);

    if (!variant) {
      return { success: false, error: 'VARIANT_NOT_FOUND' };
    }

    try {
      variant.confirmDepletion(orderId);
      
      await this.repository.save(variant);

      // Pull and publish events
      const events = variant.pullEvents();
      for (const event of events) {
        await this.eventBus.publish(event);
      }

      return { success: true, value: undefined };
    } catch (error: any) {
      if (error.message.includes('Reservation not found')) {
        return { success: false, error: 'RESERVATION_NOT_FOUND' };
      }
      throw error;
    }
  }
}
