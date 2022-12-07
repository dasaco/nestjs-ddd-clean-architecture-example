import { IsNotEmpty } from 'class-validator'
import { Query } from 'shared/application'
import { UUID } from 'shared/domain/value-objects'

export class GetOrderQuery extends Query {
  @IsNotEmpty()
  readonly orderId: UUID

  constructor(props: GetOrderQuery) {
    super()

    this.orderId = props.orderId
  }
}
