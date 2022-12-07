import { Address } from 'order/domain/value-objects/address.value-object'
import { Command, CommandProps } from 'shared/application'
import { UUID } from 'shared/domain/value-objects'

export class CreateOrderCommand extends Command {
  constructor(props: CommandProps<CreateOrderCommand>) {
    super(props)
  }

  readonly cartId: UUID

  readonly userId: UUID

  readonly shippingAddress: Address
}
