import { Injectable } from '@nestjs/common'
import { UUID } from 'shared/domain/value-objects'
import { CartClient } from 'shared/infrastructure/integrations/cart-service/client'
import { CartProviderPort } from '../application/ports/cart.provider.port'
import { CartModel } from '../domain/models/cart.model'

@Injectable()
export class CartProvider implements CartProviderPort {
  constructor(private readonly cartClient: CartClient) {}

  async getCart(cartId: UUID) {
    const { data } = await this.cartClient.getCart(cartId)

    return new CartModel(data)
  }

  async deleteCart(cartId: UUID) {
    await this.cartClient.deleteCart(cartId)
  }
}
