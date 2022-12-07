import { OrderRepositoryPort } from 'order/application/ports/order.repository.port'
import { OrderEntity, OrderProps } from 'order/domain/entities/order.entity'
import { UUID } from 'shared/domain/value-objects'
import { TypeormRepository } from 'shared/infrastructure/database/base-classes/typeorm.repository.base'
import { Repository } from 'typeorm'
import { OrderOrmEntity } from './order.orm-entity'

export class OrderRepository
  extends TypeormRepository<UUID, OrderProps, OrderEntity, OrderOrmEntity>(
    OrderOrmEntity,
  )
  implements OrderRepositoryPort
{
  constructor(orderRepository: Repository<OrderOrmEntity>) {
    super(orderRepository, null)
  }

  async findOneByIdOrThrow(orderId: UUID) {
    const order = await this.repository.findOne({
      where: {
        id: orderId.value,
      },
    })

    return order.toDomainEntity()
  }
}
