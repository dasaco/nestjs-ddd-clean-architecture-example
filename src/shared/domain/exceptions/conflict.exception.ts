import { ExceptionBase } from './exception.base'
import { ExceptionCodes } from './exception.codes'

/**
 * The request could not be completed due to a conflict with the current
 * state of the target resource
 */
export class ConflictException extends ExceptionBase {
  readonly code = ExceptionCodes.CONFLICT
}
