import { AggregateRoot } from 'shared/domain/base-classes/aggregate-root.base'
import { UUID } from 'shared/domain/value-objects'
import { OrderStatus } from '../enums/order-status.enum'
import { Address } from '../value-objects/address.value-object'
import { OrderItemEntity } from './order-item.entity'

export interface CreateOrderProps {
  customerId: UUID
  shippingAddress: Address
}

export interface OrderProps extends CreateOrderProps {
  items: OrderItemEntity[]
  status: OrderStatus
}

export class OrderEntity extends AggregateRoot<UUID, OrderProps> {
  static create(payload: CreateOrderProps): OrderEntity {
    const id = UUID.generate()

    const props: OrderProps = {
      ...payload,
      items: [],
      status: OrderStatus.PROCESSING,
    }

    return new OrderEntity({ id, props })
  }

  public validate(): void {
    if (this.props.items.length === 0) {
      throw new Error('Order must have at least one item')
    }
  }

  addItem({
    product,
    quantity,
  }: {
    product: {
      id: UUID
      name: string
      price: number
    }
    quantity: number
  }): void {
    const item = OrderItemEntity.create({
      name: product.name,
      price: product.price,
      productId: product.id,
      quantity,
    })

    this.props.items.push(item)
  }

  removeItem(productId: UUID, units: number): void {
    const item = this.getOrderItem(productId)

    if (!item) {
      return
    }

    item.removeUnits(units)

    if (item.getPropsCopy().quantity === 0) {
      this.removeOrderItem(productId)
    }
  }

  getOrderItem(productId: UUID) {
    return this.props.items.find((item) =>
      item.getPropsCopy().productId.equals(productId),
    )
  }

  removeOrderItem(productId: UUID) {
    this.props.items = this.props.items.filter(
      (item) => !item.getPropsCopy().productId.equals(productId),
    )
  }
}
