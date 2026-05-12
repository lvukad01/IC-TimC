import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { SharedModule } from '@shared/shared.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
  imports: [SharedModule, PrismaModule],
})
export class FavoritesModule {}
