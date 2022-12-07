import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { match, Result } from 'oxide.ts/dist'
import { GetOrderQuery } from 'order/application/queries/get-order/get-order.query'
import { OrderEntity } from 'order/domain/entities/order.entity'
import { QueryBusPort, QUERY_BUS } from 'shared/application'
import { UUID } from 'shared/domain/value-objects'
import { ParamName } from 'shared/infrastructure/configs'
import { OrderResponse } from '../shared/dto/order.response.dto'

@ApiTags('Order')
@Controller('orders')
export class GetOrderHttpController {
  constructor(@Inject(QUERY_BUS) private readonly queryBus: QueryBusPort) {}

  @Get(':orderId')
  async getOrder(@Param(ParamName.ORDER_ID) orderId: string) {
    const query = new GetOrderQuery({ orderId: new UUID(orderId) })

    const result: Result<OrderEntity, Error> = await this.queryBus.execute(
      query,
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
