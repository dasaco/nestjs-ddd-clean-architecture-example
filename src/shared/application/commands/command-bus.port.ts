import { Result } from 'oxide.ts';
import { Command } from './command.base';

export const COMMAND_BUS = Symbol('CommandBus');

export interface CommandBusPort {
  execute<TCommand extends Command, ReturnType>(
    command: TCommand,
  ): Promise<Result<ReturnType, Error>>;
}
