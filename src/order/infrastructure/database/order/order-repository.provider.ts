import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderRepositoryPort } from 'order/application/ports/order.repository.port'
import { OrderEntity } from 'order/domain/entities/order.entity'
import { RepositoryProvider, UNIT_OF_WORK } from 'shared/application/ports'
import { TypeormUnitOfWork } from 'shared/infrastructure/database/unit-of-work/typeorm-unit-of-work'
import { Repository } from 'typeorm'
import { OrderOrmEntity } from './order.orm-entity'
import { OrderRepository } from './order.repository'

@Injectable()
export class OrderRepositoryProvider
  implements RepositoryProvider<OrderEntity, OrderRepositoryPort>
{
  private readonly repoSingleton

  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: TypeormUnitOfWork,
    @InjectRepository(OrderOrmEntity)
    typeormRepo: Repository<OrderOrmEntity>,
  ) {
    this.repoSingleton = new OrderRepository(typeormRepo)
  }

  getRepository(correlationId?: string): OrderRepositoryPort {
    if (correlationId) {
      return new OrderRepository(
        this.unitOfWork.getOrmRepository<OrderOrmEntity>(
          OrderOrmEntity,
          correlationId,
        ),
      ).setCorrelationId(correlationId)
    }

    return this.repoSingleton
  }
}
