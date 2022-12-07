import { OrderEntity } from 'order/domain/entities/order.entity'
import { Address } from 'order/domain/value-objects/address.value-object'
import { ResponseBase } from 'shared/presentation'
import { OrderItemResponse } from './order-item.response.dto'

export class OrderResponse extends ResponseBase {
  constructor(order: OrderEntity) {
    super(order)

    const props = order.getPropsCopy()

    this.shippingAddress = props.shippingAddress
    this.items = props.items.map((item) => new OrderItemResponse(item))
  }

  readonly shippingAddress: Address

  readonly items: OrderItemResponse[]
}
