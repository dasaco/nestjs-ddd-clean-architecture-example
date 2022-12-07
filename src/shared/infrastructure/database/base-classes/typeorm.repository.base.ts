import { Repository } from 'typeorm'
import { Logger } from 'shared/application/ports/logger.port'
import { AggregateRoot } from 'shared/domain/base-classes/aggregate-root.base'
import { RepositoryPort } from 'shared/application/ports'
import { DomainEvents } from 'shared/domain/domain-events'
import { ID } from 'shared/domain/value-objects/id.value-object'
import { Entity } from 'shared/domain/base-classes/entity.base'
import { TypeormEntityBase } from './typeorm.entity.base'

export abstract class TypeormRepositoryBase<
  TEntity extends AggregateRoot<ID, object>,
  TOrmEntity extends TypeormEntityBase<ID, object, Entity<ID, object>>,
> {
  constructor(
    protected readonly repository: Repository<TOrmEntity>,
    protected readonly logger: Logger,
  ) {}

  protected correlationId?: string

  setCorrelationId(correlationId: string): this {
    this.correlationId = correlationId
    return this
  }
}

type AbstractConstructor<T> = abstract new (...args: any[]) => T

export function TypeormRepository<
  TID extends ID,
  TProps extends object,
  TDomainEntity extends AggregateRoot<TID, TProps> = AggregateRoot<TID, TProps>,
  TOrmEntity extends TypeormEntityBase<
    TID,
    TProps,
    TDomainEntity
  > = TypeormEntityBase<TID, TProps, TDomainEntity>,
>(
  OrmEntity: new (props: TDomainEntity) => TOrmEntity,
): AbstractConstructor<
  TypeormRepositoryBase<TDomainEntity, TOrmEntity> &
    RepositoryPort<TDomainEntity>
> {
  abstract class Mixin
    extends TypeormRepositoryBase<TDomainEntity, TOrmEntity>
    implements RepositoryPort<TDomainEntity>
  {
    async save(entity: TDomainEntity): Promise<TDomainEntity> {
      entity.validate() // Protecting invariant before saving

      const ormEntity = new OrmEntity(entity)

      const result = await this.repository.save(ormEntity)
      await DomainEvents.publishEvents(
        entity.id,
        this.logger,
        this.correlationId,
      )
      this.logger.debug(
        `[${entity.constructor.name}] persisted ${entity.id.value}`,
      )

      return result.toDomainEntity()
    }

    async saveMultiple(entities: TDomainEntity[]): Promise<TDomainEntity[]> {
      const ormEntities = entities.map((entity) => {
        entity.validate()
        return new OrmEntity(entity)
      })

      const result = await this.repository.save(ormEntities)
      await Promise.all(
        entities.map((entity) =>
          DomainEvents.publishEvents(
            entity.id,
            this.logger,
            this.correlationId,
          ),
        ),
      )
      this.logger.debug(
        `[${entities}]: persisted ${entities.map((entity) => entity.id)}`,
      )

      return result.map((e) => e.toDomainEntity())
    }

    async delete(entity: TDomainEntity): Promise<TDomainEntity> {
      entity.validate()

      const ormEntity = new OrmEntity(entity)
      await this.repository.remove(ormEntity)

      await DomainEvents.publishEvents(
        entity.id,
        this.logger,
        this.correlationId,
      )
      this.logger.debug(
        `[${entity.constructor.name}] deleted ${entity.id.value}`,
      )

      return entity
    }
  }

  return Mixin
}
