import { FavoritesModule } from '@favorites/favorites.module';
import { GeocodingModule } from '@geocoding/geocoding.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { S3Module } from '@s3/s3.module';
import { SharedModule } from '@shared/shared.module';
import { UsersModule } from '@users/users.module';
import { SalonsController } from './salons.controller';
import { SalonsService } from './salons.service';

@Module({
  imports: [
    PrismaModule,
    GeocodingModule,
    S3Module,
    SharedModule,
    UsersModule,
    FavoritesModule,
  ],
  controllers: [SalonsController],
  providers: [SalonsService],
  exports: [SalonsService],
})
export class SalonsModule {}
