import { CartModel } from 'order/domain/models/cart.model'
import { UUID } from 'shared/domain/value-objects'

export const CartProviderName = Symbol.for('CartProvider')

export interface CartProviderPort {
  getCart(cartId: UUID): Promise<CartModel>
  deleteCart(cartId: UUID): Promise<void>
}
