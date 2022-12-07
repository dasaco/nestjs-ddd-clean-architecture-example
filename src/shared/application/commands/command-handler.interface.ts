import { Result } from 'oxide.ts';

export interface ICommandHandler<Command, ReturnType> {
  execute(command: Command): Promise<Result<ReturnType, Error>>;
}
