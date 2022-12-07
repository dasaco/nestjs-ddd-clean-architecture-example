/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { Entity } from 'shared/domain/base-classes/entity.base'
import { ID } from 'shared/domain/value-objects/id.value-object'
import { ValueObject } from 'shared/domain/value-objects/value-object.base'

function isEntity(obj: unknown): obj is Entity<ID, object> {
  if (!obj) {
    return false
  }

  return (
    Object.prototype.hasOwnProperty.call(obj, 'toObject') &&
    Object.prototype.hasOwnProperty.call(obj, 'id') &&
    ValueObject.isValueObject((obj as Entity<ID, object>).id)
  )
}

function convertToPlainObject(item: any): any {
  if (ValueObject.isValueObject(item)) {
    return item.unpack()
  }
  if (isEntity(item)) {
    return item.toObject()
  }
  return item
}

/**
 * Converts Entity/Value Objects props to a plain object.
 * Useful for testing and debugging.
 * @param props
 */
export function convertPropsToObject(properties: any): any {
  const propertiesCopy = { ...properties }

  // eslint-disable-next-line guard-for-in
  for (const property in propertiesCopy) {
    if (Array.isArray(propertiesCopy[property])) {
      propertiesCopy[property] = (
        propertiesCopy[property] as Array<unknown>
      ).map((item) => convertToPlainObject(item))
    }
    propertiesCopy[property] = convertToPlainObject(propertiesCopy[property])
  }

  return propertiesCopy
}
