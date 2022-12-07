/* eslint-disable no-param-reassign */
import { AggregateRoot } from 'shared/domain/base-classes/aggregate-root.base'
import { Logger } from 'shared/application/ports'
import { final } from 'shared/domain/decorators/final.decorator'
import { ID } from 'shared/domain/value-objects/id.value-object'
import { DomainEvent, DomainEventHandler } from '.'

type EventName = string

export type DomainEventClass = new (...args: never[]) => DomainEvent

@final
export class DomainEvents {
  private static subscribers: Map<EventName, DomainEventHandler[]> = new Map()

  private static aggregates: AggregateRoot<ID, object>[] = []

  public static subscribe<T extends DomainEventHandler>(
    event: DomainEventClass,
    eventHandler: T,
  ): void {
    const eventName: EventName = event.name
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, [])
    }
    this.subscribers.get(eventName)?.push(eventHandler)
  }

  public static prepareForPublish(aggregate: AggregateRoot<ID, object>): void {
    const aggregateFound = !!this.findAggregateByID(aggregate.id)
    if (!aggregateFound) {
      this.aggregates.push(aggregate)
    }
  }

  public static async publishEvents(
    id: ID,
    logger: Logger,
    correlationId?: string,
  ): Promise<void> {
    const aggregate = this.findAggregateByID(id)

    if (aggregate) {
      logger.debug(
        `[${aggregate.domainEvents.map(
          (event) => event.constructor.name,
        )}] published ${aggregate.id.value}`,
      )
      await Promise.all(
        aggregate.domainEvents.map((event: DomainEvent) => {
          if (correlationId && !event.correlationId) {
            event.correlationId = correlationId
          }
          return this.publish(event, logger)
        }),
      )
      aggregate.clearEvents()
      this.removeAggregateFromPublishList(aggregate)
    }
  }

  private static findAggregateByID(
    id: ID,
  ): AggregateRoot<ID, object> | undefined {
    for (const aggregate of this.aggregates) {
      if (aggregate.id.equals(id)) {
        return aggregate
      }
    }
    return undefined
  }

  private static removeAggregateFromPublishList(
    aggregate: AggregateRoot<ID, object>,
  ): void {
    const index = this.aggregates.findIndex((a) => a.equals(aggregate))
    this.aggregates.splice(index, 1)
  }

  private static async publish(
    event: DomainEvent,
    logger: Logger,
  ): Promise<void> {
    const eventName: string = event.constructor.name

    if (this.subscribers.has(eventName)) {
      const handlers: DomainEventHandler[] =
        this.subscribers.get(eventName) || []
      await Promise.all(
        handlers.map((handler) => {
          logger.debug(
            `[${handler.constructor.name}] handling ${event.constructor.name} ${event.aggregateId}`,
          )
          return handler.handle(event)
        }),
      )
    }
  }
}
