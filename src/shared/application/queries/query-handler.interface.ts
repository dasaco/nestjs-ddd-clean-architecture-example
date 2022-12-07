import { Result } from 'oxide.ts';

export abstract class Query {}

export interface IQueryHandler<TQuery extends Query, ReturnType> {
  execute(query: TQuery): Promise<Result<ReturnType, Error>>;
}
