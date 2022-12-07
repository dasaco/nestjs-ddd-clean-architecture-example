import { DomainEvents, DomainEvent } from 'shared/domain/domain-events';
import { ID } from 'shared/domain/value-objects';
import { Entity } from './entity.base';

export abstract class AggregateRoot<
  TID extends ID,
  TProps extends object,
> extends Entity<TID, TProps> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
    DomainEvents.prepareForPublish(this);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
