import { Inject, Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Command, CommandBusPort } from 'shared/application'
import { Result } from 'oxide.ts'
import { UnitOfWorkPort, UNIT_OF_WORK } from 'shared/application/ports'

@Injectable()
export class CommandBusAdapter implements CommandBusPort {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWorkPort,
    private readonly nestCommandBus: CommandBus,
  ) {}

  execute<TCommand extends Command, ReturnType>(
    command: TCommand,
  ): Promise<Result<ReturnType, Error>> {
    return this.unitOfWork.execute(command.correlationId, async () =>
      this.nestCommandBus.execute(command),
    )
  }
}
