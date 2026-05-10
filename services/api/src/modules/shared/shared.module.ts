import { Module } from '@nestjs/common';
import { SalonsMapper } from '@salons/mapper/salons.mapper';

@Module({
  providers: [SalonsMapper],
  exports: [SalonsMapper],
})
export class SharedModule {}
