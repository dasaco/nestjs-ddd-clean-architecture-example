import { OrderItemEntity } from 'order/domain/entities/order-item.entity'
import { ResponseBase } from 'shared/presentation'

export class OrderItemResponse extends ResponseBase {
  constructor(orderItem: OrderItemEntity) {
    super(orderItem)
  }

  readonly name: string

  readonly price: string

  readonly quantity: number
}
