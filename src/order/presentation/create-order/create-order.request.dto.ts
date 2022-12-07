import { IsNotEmpty } from 'class-validator';

export class CreateOrderRequestDto {
  @IsNotEmpty()
  cartId: string;

  @IsNotEmpty()
  userId: string;

  shippingAddress: {
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    country: string;
  };
}
