import { Inject } from '@nestjs/common'
import { CommandHandler } from '@nestjs/cqrs'
import { Ok, Result } from 'oxide.ts'
import { OrderEntity } from 'order/domain/entities/order.entity'
import { ICommandHandler } from 'shared/application'
import { RepositoryProvider } from 'shared/application/ports'
import { AppLogger } from 'shared/infrastructure/monitoring'
import {
  CartProviderName,
  CartProviderPort,
} from '../../ports/cart.provider.port'
import {
  OrderRepositoryPort,
  OrderRepositoryProviderName,
} from '../../ports/order.repository.port'
import { CreateOrderCommand } from './create-order.command'

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand, OrderEntity>
{
  private readonly logger = new AppLogger(CreateOrderCommandHandler.name)

  constructor(
    @Inject(OrderRepositoryProviderName)
    private readonly orderRepoProvider: RepositoryProvider<
      OrderEntity,
      OrderRepositoryPort
    >,
    @Inject(CartProviderName)
    private readonly cartProvider: CartProviderPort,
  ) {}

  async execute(
    command: CreateOrderCommand,
  ): Promise<Result<OrderEntity, Error>> {
    const orderRepo = this.orderRepoProvider.getRepository(
      command.correlationId,
    )

    const cart = await this.cartProvider.getCart(command.cartId)
    if (!cart.items.length) {
      throw new Error('Cart is empty.')
    }

    const newOrder = OrderEntity.create({
      customerId: command.userId,
      shippingAddress: command.shippingAddress,
    })

    cart.items.forEach((item) => {
      newOrder.addItem({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
        },
        quantity: item.quantity,
      })
    })

    await orderRepo.save(newOrder)

    try {
      await this.cartProvider.deleteCart(cart.id)
    } catch {
      this.logger.error('Could not delete cart.')
    }

    return Ok(newOrder)
  }
}
