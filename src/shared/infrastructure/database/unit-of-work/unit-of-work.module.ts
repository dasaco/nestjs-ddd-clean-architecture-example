import { Module } from '@nestjs/common'
import { UNIT_OF_WORK } from 'shared/application/ports'
import { AppLogger } from 'shared/infrastructure/monitoring'
import { DataSource } from 'typeorm'
import { TypeormUnitOfWork } from './typeorm-unit-of-work'

const unitOfWorkSingletonProvider = {
  provide: UNIT_OF_WORK,
  useFactory: (dataSource: DataSource) =>
    new TypeormUnitOfWork(new AppLogger('UnitOfWork'), dataSource),
  inject: [DataSource],
}

@Module({
  imports: [],
  providers: [unitOfWorkSingletonProvider],
  exports: [UNIT_OF_WORK],
})
export class UnitOfWorkModule {}
