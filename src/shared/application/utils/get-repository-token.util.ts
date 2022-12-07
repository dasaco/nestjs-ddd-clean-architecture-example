import { Entity } from 'shared/domain/base-classes/entity.base'
import { Constructable } from 'shared/domain/types'
import { ID } from 'shared/domain/value-objects'

export function getRepositoryProviderToken(
  entity: Constructable<Entity<ID, any>>,
): string {
  return `${entity.name}RepositoryProvider`
}
