import { Inject } from '@nestjs/common'
import { QueryHandler } from '@nestjs/cqrs'
import { Ok, Result } from 'oxide.ts/dist'
import { OrderEntity } from 'order/domain/entities/order.entity'
import { IQueryHandler } from 'shared/application'
import {
  OrderRepositoryPort,
  OrderRepositoryProviderName,
} from '../../ports/order.repository.port'
import { GetOrderQuery } from './get-order.query'

@QueryHandler(GetOrderQuery)
export class GetOrderHandler
  implements IQueryHandler<GetOrderQuery, OrderEntity>
{
  constructor(
    @Inject(OrderRepositoryProviderName)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(query: GetOrderQuery): Promise<Result<OrderEntity, Error>> {
    const order = await this.orderRepository.findOneByIdOrThrow(query.orderId)
    return Ok(order)
  }
}
