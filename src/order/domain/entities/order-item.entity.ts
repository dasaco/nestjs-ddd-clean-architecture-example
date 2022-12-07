import { Entity } from 'shared/domain/base-classes/entity.base'
import { UUID } from 'shared/domain/value-objects'

export interface OrderItemProps {
  quantity: number
  name: string
  price: number
  productId: UUID
}

export class OrderItemEntity extends Entity<UUID, OrderItemProps> {
  static create(props: OrderItemProps): OrderItemEntity {
    const id = UUID.generate()

    return new OrderItemEntity({ id, props })
  }

  public validate(): void {
    if (this.props.quantity < 0) {
      throw new Error('Quantity must be greater than 0')
    }
  }

  addUnits(units: number): void {
    this.props.quantity += units
  }

  removeUnits(units: number): void {
    if (this.props.quantity - units < 0) {
      this.props.quantity = 0
    } else {
      this.props.quantity -= units
    }
  }
}
