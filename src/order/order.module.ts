import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartProviderName } from './application/ports/cart.provider.port';
import { OrderRepositoryProviderName } from './application/ports/order.repository.port';
import { CartProvider } from './infrastructure/cart.provider';
import { OrderRepositoryProvider } from './infrastructure/database/order/order-repository.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CartProviderName,
      useClass: CartProvider,
    },
    {
      provide: OrderRepositoryProviderName,
      useClass: OrderRepositoryProvider,
    },
  ],
  exports: [],
})
export class OrderModule {}
