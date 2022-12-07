import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { COMMAND_BUS, QUERY_BUS } from 'shared/application'
import { UnitOfWorkModule } from 'shared/infrastructure/database/unit-of-work/unit-of-work.module'
import { CommandBusAdapter } from './command.bus'
import { QueryBusAdapter } from './query.bus'

const providers = [
  {
    provide: COMMAND_BUS,
    useClass: CommandBusAdapter,
  },
  {
    provide: QUERY_BUS,
    useClass: QueryBusAdapter,
  },
]

@Module({
  imports: [CqrsModule, UnitOfWorkModule],
  providers: [...providers],
  exports: [COMMAND_BUS, QUERY_BUS],
})
export class BusModule {}
