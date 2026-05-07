import { GeocodingModule } from '@geocoding/geocoding.module';
import { Module } from '@nestjs/common';
import { S3Module } from '@s3/s3.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SalonsController } from './salons.controller';
import { SalonsService } from './salons.service';

@Module({
  imports: [PrismaModule, GeocodingModule, S3Module],
  controllers: [SalonsController],
  providers: [SalonsService],
})
export class SalonsModule {}
