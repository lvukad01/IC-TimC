import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [SharedModule],
})
export class FavoritesModule {}
