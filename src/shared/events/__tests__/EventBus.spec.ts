import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventBus } from '../EventBus';
import type { DomainEvent } from '../DomainEvent';

interface TestEvent extends DomainEvent {
    eventName: 'TestEvent';
    value: string;
}

describe('EventBus', () => {
    let eventBus: EventBus;

    beforeEach(() => {
        eventBus = new EventBus();
    });

    it('should allow multiple subscribers to the same event', async () => {
        const handler1 = vi.fn();
        const handler2 = vi.fn();

        eventBus.subscribe('TestEvent', handler1);
        eventBus.subscribe('TestEvent', handler2);

        const event: TestEvent = {
            eventName: 'TestEvent',
            timestamp: Date.now(),
            value: 'hello',
        };

        await eventBus.publish(event);

        expect(handler1).toHaveBeenCalledWith(event);
        expect(handler2).toHaveBeenCalledWith(event);
    });

    it('should execute handlers asynchronously', async () => {
        let executionOrder: string[] = [];

        eventBus.subscribe('TestEvent', async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            executionOrder.push('handler');
        });

        const event: TestEvent = {
            eventName: 'TestEvent',
            timestamp: Date.now(),
            value: 'async',
        };

        const publishPromise = eventBus.publish(event);
        executionOrder.push('published');

        await publishPromise;

        // Because publish is async and waits for handlers, 
        // 'published' will be pushed before the handler completes its timeout 
        // BUT 'publish' only resolves after handlers are done.
        expect(executionOrder).toEqual(['published', 'handler']);
    });

    it('should allow unsubscribing via the returned function', async () => {
        const handler = vi.fn();
        const unsubscribe = eventBus.subscribe('TestEvent', handler);

        const event: TestEvent = {
            eventName: 'TestEvent',
            timestamp: Date.now(),
            value: 'unsub',
        };

        unsubscribe();
        await eventBus.publish(event);

        expect(handler).not.toHaveBeenCalled();
    });

    it('should isolate errors in handlers (one crash does not stop others)', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const failingHandler = vi.fn().mockImplementation(() => {
            throw new Error('Boom!');
        });
        const succeedingHandler = vi.fn();

        eventBus.subscribe('TestEvent', failingHandler);
        eventBus.subscribe('TestEvent', succeedingHandler);

        const event: TestEvent = {
            eventName: 'TestEvent',
            timestamp: Date.now(),
            value: 'error-isolation',
        };

        // Should NOT throw
        await expect(eventBus.publish(event)).resolves.not.toThrow();

        expect(failingHandler).toHaveBeenCalled();
        expect(succeedingHandler).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Error in handler for event "TestEvent"'),
            expect.any(Error)
        );

        consoleSpy.mockRestore();
    });

    it('should handle events with no subscribers gracefully', async () => {
        const event: DomainEvent = {
            eventName: 'NoSubEvent',
            timestamp: Date.now(),
        };

        await expect(eventBus.publish(event)).resolves.not.toThrow();
    });
});
