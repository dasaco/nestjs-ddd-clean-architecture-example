import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { match, Result } from 'oxide.ts/dist'
import { CreateOrderCommand } from 'order/application/commands/create-order/create-order.command'
import { OrderEntity } from 'order/domain/entities/order.entity'
import { Address } from 'order/domain/value-objects/address.value-object'
import { CommandBusPort, COMMAND_BUS } from 'shared/application'
import { UUID } from 'shared/domain/value-objects'
import { OrderResponse } from '../shared/dto/order.response.dto'
import { CreateOrderRequestDto } from './create-order.request.dto'

@ApiTags('Order')
@Controller('orders') // Could be value from router config
export class CreateOrderHttpController {
  constructor(
    @Inject(COMMAND_BUS) private readonly commandBus: CommandBusPort,
  ) {}

  @Post()
  async create(@Body() body: CreateOrderRequestDto) {
    const command = new CreateOrderCommand({
      userId: new UUID(body.userId),
      cartId: new UUID(body.cartId),
      shippingAddress: new Address(body.shippingAddress),
    })

    const result: Result<OrderEntity, Error> = await this.commandBus.execute(
      command,
    )

    return match(result, {
      Ok: (order) => {
        return new OrderResponse(order)
      },
      Err: (error) => {
        // You can add handling here for custom domain errors
        throw error
      },
    })
  }
}
