import { Result } from 'oxide.ts'
import { Query } from './query-handler.interface'

export const QUERY_BUS = Symbol('QueryBus')

export interface QueryBusPort {
  execute<TQuery extends Query, ReturnType>(command: TQuery): Promise<Result<ReturnType, Error>>
}
