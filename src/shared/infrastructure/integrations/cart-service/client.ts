import axios from 'axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UUID } from 'shared/domain/value-objects'

@Injectable()
export class CartClient {
  constructor(private config: ConfigService) {}

  #constructUrl(path: string) {
    return `${this.config.get('cartServiceHost')}${path}`
  }

  async getCart(cartId: UUID) {
    const url = this.#constructUrl(`/carts/${cartId}`)
    return axios.get(url)
  }

  async deleteCart(cartId: UUID) {
    const url = this.#constructUrl(`/carts/${cartId}`)
    return axios.delete(url)
  }
}
