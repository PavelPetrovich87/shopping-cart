import { Result } from '@/shared/domain/Result';
import { IStockRepository } from '../ports/IStockRepository';
import { IEventBus } from '@/shared/events/IEventBus';

export class ReleaseStockReservation {
  constructor(
    private readonly repository: IStockRepository,
    private readonly eventBus: IEventBus
  ) {}

  async execute(skuId: string, orderId: string): Promise<Result<void, 'VARIANT_NOT_FOUND'>> {
    const variant = await this.repository.findBySku(skuId);

    if (!variant) {
      return { success: false, error: 'VARIANT_NOT_FOUND' };
    }

    variant.releaseReservation(orderId);
    
    await this.repository.save(variant);

    // Pull and publish events
    const events = variant.pullEvents();
    for (const event of events) {
      await this.eventBus.publish(event);
    }

    return { success: true, value: undefined };
  }
}
