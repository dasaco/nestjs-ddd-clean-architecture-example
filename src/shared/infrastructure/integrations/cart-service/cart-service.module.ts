import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartClient } from './client';

@Module({
  imports: [ConfigModule],
  providers: [CartClient],
  exports: [CartClient],
})
export class CartServiceModule {}
