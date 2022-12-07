import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import {
  ExceptionBase,
  ExceptionCodes,
  SerializedException,
} from 'shared/domain/exceptions'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { IConfig } from 'shared/infrastructure/configs/config'
import { AppLogger } from 'shared/infrastructure/monitoring'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  readonly #debug: boolean

  readonly #logger = new AppLogger(AllExceptionsFilter.name)

  constructor(configs: ConfigService<IConfig, true>) {
    this.#debug = configs.get('debug', { infer: true })
  }

  catch(exception: Error, host: ArgumentsHost) {
    this.#logger.error(exception.message, {
      extra: {
        stack: exception.stack,
      },
    })

    if (exception instanceof HttpException) {
      return this.handleHttpError(exception, host)
    }

    if (exception instanceof ExceptionBase) {
      return this.handleDomainError(exception, host)
    }

    return this.handleSystemError(exception, host)
  }

  private handleDomainError(exception: ExceptionBase, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const jsonResponse = {
      ...exception.toJSON(),
      stack: this.#debug ? exception.stack : undefined,
    }

    if (exception.code === ExceptionCodes.NOT_FOUND) {
      return response.status(HttpStatus.NOT_FOUND).json(jsonResponse)
    }

    if (exception.code === ExceptionCodes.UNAUTHORIZED) {
      return response.status(HttpStatus.UNAUTHORIZED).json(jsonResponse)
    }

    if (exception.code === ExceptionCodes.CONFLICT) {
      return response.status(HttpStatus.CONFLICT).json(jsonResponse)
    }

    return response.status(HttpStatus.BAD_REQUEST).json(jsonResponse)
  }

  private handleHttpError(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus()
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const { code, message } = this.getErrorDataFromException(
      status,
      exception.getResponse() as Record<string, string>,
    )

    const serializedException: SerializedException = {
      code,
      message,
      stack: this.#debug ? exception.stack : undefined,
    }

    response.status(status).json(serializedException)
  }

  private handleSystemError(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const serializedException: SerializedException = {
      code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
      message: 'Internal Server Error',
    }

    if (this.#debug) {
      serializedException.stack = exception.stack
      serializedException.metadata = { error: exception.message }
    }

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(serializedException)
  }

  private getErrorDataFromException(
    status: number,
    errorResponse: Record<string, string>,
  ) {
    let code
    let message
    switch (status) {
      case 400: {
        code = ExceptionCodes.ARGUMENT_INVALID
        message = errorResponse.message || 'Bad request (400)'
        break
      }
      case 401: {
        code = ExceptionCodes.UNAUTHORIZED
        message = errorResponse.message || 'Unauthorized (401)'
        break
      }
      default: {
        code = status.toString()
        message = errorResponse.message || `Unknown error occurred (${status})`
      }
    }
    return { code, message }
  }
}
