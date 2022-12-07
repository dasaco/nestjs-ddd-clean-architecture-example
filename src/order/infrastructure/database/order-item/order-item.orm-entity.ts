import {
  OrderItemEntity,
  OrderItemProps,
} from 'order/domain/entities/order-item.entity'
import { UUID } from 'shared/domain/value-objects'
import { TypeormEntity } from 'shared/infrastructure/database/base-classes/typeorm.entity.base'
import { Column, Entity, ManyToOne } from 'typeorm'
import { OrderOrmEntity } from '../order/order.orm-entity'

@Entity('order_item')
export class OrderItemOrmEntity extends TypeormEntity<
  UUID,
  OrderItemProps,
  OrderItemEntity
>(OrderItemEntity) {
  @ManyToOne(() => OrderOrmEntity, (order) => order.items, {
    eager: false,
    cascade: false,
  })
  order: OrderItemEntity[]

  @Column({ type: 'varchar', length: 10 })
  name: string

  @Column({ type: 'number' })
  price: number

  @Column({ type: 'number' })
  quantity: number

  @Column({ type: 'varchar', length: 46 })
  product_id: string

  protected toDomainProps(): { id: UUID; props: OrderItemProps } {
    const id = new UUID(this.id)

    const props: OrderItemProps = {
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      productId: new UUID(this.product_id),
    }

    return { id, props }
  }

  protected withDomainProps(props: OrderItemProps): void {
    this.name = props.name
    this.price = props.price
  }
}
