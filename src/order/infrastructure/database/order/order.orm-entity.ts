import { OrderEntity, OrderProps } from 'order/domain/entities/order.entity'
import { OrderStatus } from 'order/domain/enums/order-status.enum'
import { Address } from 'order/domain/value-objects/address.value-object'
import { UUID } from 'shared/domain/value-objects'
import { TypeormEntity } from 'shared/infrastructure/database/base-classes/typeorm.entity.base'
import { Column, Entity, OneToMany } from 'typeorm'
import { OrderItemOrmEntity } from '../order-item/order-item.orm-entity'

@Entity('order')
export class OrderOrmEntity extends TypeormEntity<
  UUID,
  OrderProps,
  OrderEntity
>(OrderEntity) {
  @OneToMany(() => OrderItemOrmEntity, (orderItem) => orderItem.order, {
    eager: true,
    cascade: true,
  })
  items: OrderItemOrmEntity[]

  @Column({ type: 'varchar', length: 46 })
  user_id: string

  @Column({ type: 'varchar', length: 255 })
  address_line1: string

  @Column({ type: 'varchar', length: 255 })
  address_line2: string

  @Column({ type: 'varchar', length: 30 })
  zip_code: string

  @Column({ type: 'varchar', length: 50 })
  city: string

  @Column({ type: 'varchar', length: 100 })
  country: string

  @Column({ type: 'varchar', length: 100 })
  status: OrderStatus

  protected toDomainProps(): { id: UUID; props: OrderProps } {
    const id = new UUID(this.id)

    const props: OrderProps = {
      shippingAddress: new Address({
        addressLine1: this.address_line1,
        addressLine2: this.address_line2,
        zipCode: this.zip_code,
        city: this.city,
        country: this.country,
      }),
      items: this.items.map((item) => item.toDomainEntity()),
      status: this.status,
      customerId: new UUID(this.user_id),
    }

    return { id, props }
  }

  protected withDomainProps(props: OrderProps): void {
    const shippingAddress = props.shippingAddress.unpack()
    this.address_line1 = shippingAddress.addressLine1
    this.address_line2 = shippingAddress.addressLine2
    this.city = shippingAddress.city
    this.country = shippingAddress.country
    this.zip_code = shippingAddress.zipCode

    this.items = props.items.map((item) => new OrderItemOrmEntity(item))

    this.status = props.status
  }
}
