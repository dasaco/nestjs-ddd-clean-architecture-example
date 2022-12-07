import { OrderEntity } from 'order/domain/entities/order.entity'
import { RepositoryPort } from 'shared/application/ports'
import { UUID } from 'shared/domain/value-objects'

export const OrderRepositoryProviderName = Symbol.for('OrderRepositoryProvider')

export interface OrderRepositoryPort extends RepositoryPort<OrderEntity> {
  findOneByIdOrThrow(id: UUID): Promise<OrderEntity>
}
