import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { Query, QueryBusPort } from 'shared/application'
import { Result } from 'oxide.ts'

@Injectable()
export class QueryBusAdapter implements QueryBusPort {
  constructor(private readonly nestQueryBus: QueryBus) {}

  execute<TQuery extends Query, ReturnType>(
    command: TQuery,
  ): Promise<Result<ReturnType, Error>> {
    return this.nestQueryBus.execute(command)
  }
}
