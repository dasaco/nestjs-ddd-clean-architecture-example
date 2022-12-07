import { ExceptionBase } from './exception.base'
import { ExceptionCodes } from './exception.codes'

/**
 * Used to indicate that an entity was not found.
 */
export class EntityNotFound extends ExceptionBase {
  readonly code = ExceptionCodes.NOT_FOUND
}
