import { ApiProperty } from '@nestjs/swagger'
import { BaseEntityProps } from 'shared/domain/base-classes/entity.base'
import { IdResponse } from 'shared/presentation/dtos/id.response.dto'

/**
 * Most of our response objects will have properties like
 * id, createdAt and updatedAt so we can move them to a
 * separate class and extend it to avoid duplication.
 */
export class ResponseBase extends IdResponse {
  constructor(entity: BaseEntityProps) {
    super(entity.id.value)
    this.createdAt = entity.createdAt.value.toISOString()
    this.updatedAt = entity.updatedAt.value.toISOString()
  }

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z', format: 'date-time' })
  readonly createdAt: string

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z', format: 'date-time' })
  readonly updatedAt: string
}
