import { ActionResponseDto } from '@common/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { SalonListResponseDto } from '@salons/dto/salon-response.dto';
import { SalonsMapper } from '@salons/mapper/salons.mapper';
import { SALON_LIST_INCLUDE } from '../salons/salons.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: SalonsMapper,
  ) {}

  async create(userId: string, salonId: string): Promise<ActionResponseDto> {
    const existingFavorite = await this.prisma.favorites.findFirst({
      where: {
        userId,
        salonId,
      },
    });

    if (existingFavorite) {
      return {
        id: existingFavorite.id,
        message: 'Salon is already in favorites',
      };
    }

    const favorite = await this.prisma.favorites.create({
      data: {
        userId,
        salonId,
      },
    });

    return {
      id: favorite.id,
      message: 'Salon added to favorites',
    };
  }

  async findUserFavorites(userId: string): Promise<SalonListResponseDto[]> {
    const favorites = await this.prisma.favorites.findMany({
      where: { userId },
      include: {
        salon: {
          include: SALON_LIST_INCLUDE,
        },
      },
    });
    const favoriteSet = new Set(favorites.map((f) => f.salonId));

    return favorites.map((fav) =>
      this.mapper.mapSalonListItem(fav.salon, favoriteSet),
    );
  }

  async remove(userId: string, salonId: string): Promise<ActionResponseDto> {
    const favorite = await this.prisma.favorites.delete({
      where: {
        userId_salonId: {
          userId,
          salonId,
        },
      },
    });

    return {
      id: favorite.id,
      message: 'Product removed from favorites',
    };
  }

  async getFavoriteSalonIds(userId: string): Promise<Set<string>> {
    const favoriteSalons = await this.prisma.favorites.findMany({
      where: { userId },
      select: { salonId: true },
    });

    return new Set(favoriteSalons.map((f) => f.salonId));
  }
}
