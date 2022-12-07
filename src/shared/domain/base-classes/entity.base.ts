import { ArgumentOutOfRangeException } from 'shared/domain/exceptions'
import { Guard } from 'shared/domain/guards/guard'
import { Constructable } from 'shared/domain/types'
import { convertPropsToObject } from 'shared/domain/utils'
import { DateVO } from 'shared/domain/value-objects/date.value-object'
import { ID } from 'shared/domain/value-objects/id.value-object'

export interface BaseEntityProps {
  id: ID
  createdAt: DateVO
  updatedAt: DateVO
}

export interface CreateEntityProps<TID extends ID, T> {
  id: TID
  props: T
  createdAt?: DateVO
  updatedAt?: DateVO
}

export abstract class Entity<TID extends ID, TProps extends object> {
  constructor({
    id,
    createdAt,
    updatedAt,
    props,
  }: CreateEntityProps<TID, TProps>) {
    this._id = id
    this.validateProps(props) // Validates
    const now = DateVO.now()
    this._createdAt = createdAt || now
    this._updatedAt = updatedAt || now
    this.props = props
    this.validate() // Validate that the aggregate root has to implement
  }

  protected readonly props: TProps

  // ID is set in the entity to support different ID types
  private readonly _id: TID

  private readonly _createdAt: DateVO

  private _updatedAt: DateVO

  get id(): TID {
    return this._id
  }

  get createdAt(): DateVO {
    return this._createdAt
  }

  get updatedAt(): DateVO {
    return this._updatedAt
  }

  static isEntity(entity: unknown): entity is Entity<ID, object> {
    return entity instanceof Entity
  }

  /**
   *  Check if two entities are the same Entity. Checks using ID field.
   * @param object Entity
   */
  public equals(object?: Entity<TID, TProps>): boolean {
    if (object === null || object === undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!Entity.isEntity(object)) {
      return false
    }

    return this.id ? this.id.equals(object.id) : false
  }

  withProps<T extends Entity<TID, TProps> = Entity<TID, TProps>>(
    props: TProps,
  ): T {
    return new (this.constructor as Constructable<T>)({
      id: this._id,
      props,
      createdAt: this._createdAt,
      updatedAt: DateVO.now(),
    })
  }

  public getPropsCopy(): TProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...this.props,
    }
    return Object.freeze(propsCopy)
  }

  public toObject(): unknown {
    const plainProps = convertPropsToObject(this.props)

    const result = {
      id: this._id.value,
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
      ...plainProps,
    }
    return Object.freeze(result)
  }

  /**
   * Validate invariant
   */
  public abstract validate(): void

  private validateProps(props: TProps): void {
    const maxProps = 50

    Guard.forNullOrEmpty(props, 'Entity props should not be empty')
    Guard.forUnexpectedType(props, 'object')

    if (Object.keys(props).length > maxProps) {
      throw new ArgumentOutOfRangeException(
        `Entity props should not have more than ${maxProps} properties`,
      )
    }
  }
}
