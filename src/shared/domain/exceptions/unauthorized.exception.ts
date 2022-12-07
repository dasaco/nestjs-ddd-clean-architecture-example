import { ExceptionBase } from './exception.base'
import { ExceptionCodes } from './exception.codes'

/**
 * Used to indicate that request is not authorized, authorization data is wrong/missing
 */
export class UnauthorizedException extends ExceptionBase {
  readonly code = ExceptionCodes.UNAUTHORIZED
}
