import 'reflect-metadata'
/* eslint-disable new-cap */
import { Entity } from 'shared/domain/base-classes/entity.base'
import { Constructable } from 'shared/domain/types'
import { ID } from 'shared/domain/value-objects'

/** Private access symbol */
const factoryForKey = Symbol('FactoryFor')

/**
 * The FactoryContainer maps entity class name strings
 * to their respective factory classes.
 *
 * @example
 * class Book {...}
 *
 * @FactoryFor(Book)
 * class BookFactory {...}
 *
 * Then within the container, the class name passed
 * into factory for is retrieve and mapped.
 *
 * @param entity: The entity class to map to in container
 * @returns TS class decorator function
 */
export const FactoryFor =
  (entity: Constructable<Entity<ID, any>>) => (target: any) => {
    Reflect.defineMetadata(factoryForKey, { entity }, target)
  }

export function getFactoryFor<T extends Entity<ID, any>>(
  target: any,
): { entity: Constructable<T> } {
  return Reflect.getMetadata(factoryForKey, target)
}
