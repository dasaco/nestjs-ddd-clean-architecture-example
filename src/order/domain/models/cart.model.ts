import { IsNotEmpty } from 'class-validator'
import { UUID } from 'shared/domain/value-objects'
import { ProductModel } from './product.model'

export class CartModel {
  @IsNotEmpty()
  readonly id: UUID

  @IsNotEmpty()
  readonly items: {
    product: ProductModel
    quantity: number
  }[]

  constructor(props: CartModel) {
    this.id = props.id
    this.items = props.items
  }
}
