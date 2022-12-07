import {
  CreateEntityProps,
  Entity,
} from 'shared/domain/base-classes/entity.base'
import { DateVO, ID } from 'shared/domain/value-objects'
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm'

export abstract class TypeormEntityBase<
  TID extends ID,
  TProps extends object,
  TDomainEntity extends Entity<TID, TProps>,
> {
  constructor(domainEntity?: TDomainEntity) {
    if (domainEntity) {
      this.id = domainEntity.id.value
      this.created_at = domainEntity.createdAt.value
      this.updated_at = domainEntity.updatedAt.value

      this.withDomainProps(domainEntity.getPropsCopy())
    }
  }

  @PrimaryColumn({ update: false })
  id: string

  @CreateDateColumn({
    update: false,
  })
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  protected abstract toDomainProps(): { id: TID; props: TProps }

  protected abstract withDomainProps(props: TProps): void

  abstract toDomainEntity(): TDomainEntity
}

type AbstractConstructor<M, T> = abstract new (domainEntity?: M) => T

export function TypeormEntity<
  TID extends ID,
  TProps extends object,
  TDomainEntity extends Entity<TID, TProps>,
>(
  DomainEntity: new (props: CreateEntityProps<TID, TProps>) => TDomainEntity,
): AbstractConstructor<
  TDomainEntity,
  TypeormEntityBase<TID, TProps, TDomainEntity> & {
    toDomainEntity(): TDomainEntity
  }
> {
  abstract class MixinStrategy extends TypeormEntityBase<
    TID,
    TProps,
    TDomainEntity
  > {
    toDomainEntity(): TDomainEntity {
      const { id, props } = this.toDomainProps()

      return new DomainEntity({
        id,
        props,
        createdAt: new DateVO(this.created_at),
        updatedAt: new DateVO(this.updated_at),
      })
    }
  }

  return MixinStrategy
}
