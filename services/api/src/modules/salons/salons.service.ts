import { ActionResponseDto, PaginationQueryDto } from '@common/common';
import { InvalidDepositException } from '@exceptions/salon.exception';
import { GeocodingService } from '@geocoding/geocoding.service';
import { buildFullAdress, isAddressChanged } from '@helpers/adress-helper';
import { resolveFavorites } from '@helpers/resolve-favorites.helper';
import { ErrorMessages, VALIDATION_MESSAGES } from '@lumii/messages';
import {
  DepositType,
  MAX_PERCENTAGE_DEPOSIT_VALUE,
  MediaType,
  MIN_FIXED_DEPOSIT_VALUE,
  MIN_PERCENTAGE_DEPOSIT_VALUE,
  SalonStatus,
  UserRole,
} from '@lumii/types';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { PaginatedResponse } from '@response/paginated-response.dto';
import { S3Service } from '@s3/s3.service';
import { SalonsWithReviews } from '@tstypes/salon';
import { UsersService } from '@users/users.service';
import { paginate } from '@utils/paginate.util';
import { getBoundsOfDistance, isPointWithinRadius } from 'geolib';
import 'multer';
import { AddCategoryDto } from './dto/add-category.dto';
import { CreatePaymentConfigDto } from './dto/create-payment-config.dto';
import { CreateSalonDto } from './dto/create-salon.dto';
import { FindSalonsQueryDto } from './dto/find-salons-query.dto';
import {
  SalonDetailResponseDto,
  SalonListResponseDto,
} from './dto/salon-response.dto';
import { UpdatePaymentConfigDto } from './dto/update-payment-config.dto';
import type { UpdateSalonDto } from './dto/update-salon.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UploadMediaDto } from './dto/upload-media.dto';
import { SalonsMapper } from './mapper/salons.mapper';

const RADIUS_METERS = 1000;

export const SALON_LIST_INCLUDE = {
  media: true,
  _count: {
    select: {
      reviews: true,
    },
  },
  reviews: {
    select: {
      rating: true,
    },
  },
} as const;

const STATUS_FILTER = { status: SalonStatus.ACTIVE };

@Injectable()
export class SalonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geocodingService: GeocodingService,
    private readonly s3Service: S3Service,
    private readonly mapper: SalonsMapper,
    private readonly usersService: UsersService,
  ) {}

  async findAll(
    {
      search,
      city,
      category,
      page,
      limit,
      date,
      serviceId,
    }: FindSalonsQueryDto,
    userId?: string,
  ): Promise<PaginatedResponse<SalonListResponseDto>> {
    if (date && serviceId) {
      const availableSalons = await this.findAvailableSalons(
        date,
        serviceId,
        city,
      );
      const favorites = await resolveFavorites(userId);
      return {
        results: availableSalons.map((salon) =>
          this.mapper.mapSalonListItem(salon as SalonsWithReviews, favorites),
        ),
        meta: {
          total: availableSalons.length,
          limit: availableSalons.length,
          page: 1,
          lastPage: 1,
          prev: null,
          next: null,
        },
      };
    }

    const where: any = STATUS_FILTER;
    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (category) {
      where.categories = {
        some: { category: category },
      };
    }

    const salons = await paginate({
      model: this.prisma.salons,
      where,
      page,
      limit,
      include: SALON_LIST_INCLUDE,
    });

    const favorites = await resolveFavorites(userId);

    return {
      ...salons,
      results: salons.results.map((salon: SalonsWithReviews) =>
        this.mapper.mapSalonListItem(salon, favorites),
      ),
    };
  }

  async getSalonById(
    id: string,
    userId?: string,
  ): Promise<SalonDetailResponseDto> {
    const salon = await this.prisma.salons.findUnique({
      where: { id, ...STATUS_FILTER },
      include: { media: true },
    });
    if (!salon) {
      throw new NotFoundException(ErrorMessages.notFound('Salon'));
    }

    const favorites = await resolveFavorites(userId);

    return this.mapper.mapSalonDetails(salon, favorites);
  }

  async createSalon(userId: string, createSalonDto: CreateSalonDto) {
    const { street, city, zipcode, country } = createSalonDto;

    const coordinates = await this.geocodingService.geocode({
      street,
      city,
      zipcode,
      country,
    });

    return this.prisma.$transaction(async (tx) => {
      const salon = await tx.salons.create({
        data: {
          ownerId: userId,
          name: createSalonDto.name,
          city: createSalonDto.city,
          street: createSalonDto.street,
          country: createSalonDto.country,
          zipcode: createSalonDto.zipcode,
          status: SalonStatus.PENDING,
          lat: coordinates.lat,
          lng: coordinates.lng,
        },
      });

      if (createSalonDto.categories?.length) {
        await tx.salonCategories.createMany({
          data: createSalonDto.categories.map((category) => ({
            salonId: salon.id,
            category,
          })),
        });
      }
      await tx.users.update({
        where: { id: userId },
        data: { role: UserRole.SALON_OWNER },
      });
      return salon;
    });
  }

  async updateSalon(id: string, updateSalonDto: UpdateSalonDto) {
    const salon = await this.getSalonById(id);

    if (!salon) throw new NotFoundException(ErrorMessages.notFound('Salon'));

    const existingAddress = {
      street: salon.street,
      city: salon.city,
      zipcode: salon.zipcode,
      country: salon.country,
    };

    const mergedAdress = buildFullAdress(updateSalonDto, existingAddress);
    const addressChanged = isAddressChanged(updateSalonDto);

    let coordinates;
    if (addressChanged)
      coordinates = await this.geocodingService.geocode(mergedAdress);

    return this.prisma.salons.update({
      where: { id },
      data: { ...updateSalonDto, ...coordinates },
    });
  }

  async deleteSalon(id: string) {
    await this.getSalonById(id);
    return this.prisma.salons.delete({ where: { id } });
  }

  async uploadMedia(
    salonId: string,
    file: Express.Multer.File,
    media: UploadMediaDto,
  ) {
    const salon = await this.getSalonById(salonId);

    if (!salon) throw new NotFoundException(ErrorMessages.notFound('Salon'));

    const existingOrder = await this.prisma.salonMedia.findFirst({
      where: { salonId: salonId, sortOrder: media.sortOrder },
    });

    if (existingOrder)
      throw new ConflictException('Media with this sort_order already exists');

    if (media.type === MediaType.PROFILE && media.sortOrder !== 0)
      throw new ConflictException('Profile image must have sort_order = 0');

    if (media.type !== MediaType.PROFILE && media.sortOrder === 0)
      throw new ConflictException('Only profile image can have sort_order = 0');

    if (media.type === MediaType.PROFILE) {
      const existingProfile = await this.prisma.salonMedia.findFirst({
        where: { salonId: salonId, type: MediaType.PROFILE },
      });

      if (existingProfile) {
        throw new ConflictException('Profile image already exists');
      }
    }

    const key = await this.s3Service.uploadFile(file);

    try {
      await this.prisma.salonMedia.create({
        data: {
          salonId: salonId,
          key,
          type: media.type,
          sortOrder: media.sortOrder,
        },
      });
    } catch (err) {
      await this.s3Service.deleteFile(key);
      throw err;
    }
  }

  async addCategory(salonId: string, addCategoryDto: AddCategoryDto) {
    await this.getSalonById(salonId);
    return this.prisma.salonCategories.create({
      data: {
        salonId: salonId,
        category: addCategoryDto.category,
      },
    });
  }

  async updateStatus(salonId: string, updateStatusDto: UpdateStatusDto) {
    await this.getSalonById(salonId);
    return this.prisma.salons.update({
      where: { id: salonId },
      data: { status: updateStatusDto.status },
    });
  }

  async deleteMedia(
    salonId: string,
    mediaId: string,
  ): Promise<ActionResponseDto> {
    const media = await this.prisma.salonMedia.findFirst({
      where: { id: mediaId, salonId: salonId },
    });

    if (!media) throw new NotFoundException(ErrorMessages.notFound('Media'));

    await this.s3Service.deleteFile(media.key);

    await this.prisma.salonMedia.delete({
      where: { id: mediaId },
    });

    return {
      id: mediaId,
      message: 'Media deleted successfully',
    };
  }

  async removeCategory(
    salonId: string,
    categoryId: string,
  ): Promise<ActionResponseDto> {
    await this.getSalonById(salonId);
    await this.prisma.salonCategories.delete({
      where: { id: categoryId, salonId: salonId },
    });
    return {
      id: categoryId,
      message: 'Category deleted successfully',
    };
  }

  async findPendingSalons(userId: string): Promise<SalonListResponseDto[]> {
    const pendingSalons = await this.prisma.salons.findMany({
      where: { status: SalonStatus.PENDING },
      include: SALON_LIST_INCLUDE,
    });

    const favorites = await resolveFavorites(userId);

    return pendingSalons.map((salon) =>
      this.mapper.mapSalonListItem(salon, favorites),
    );
  }

  async createPaymentConfig(salonId: string, dto: CreatePaymentConfigDto) {
    const salon = await this.prisma.salons.findUnique({
      where: { id: salonId },
      include: { config: true },
    });

    if (!salon) throw new NotFoundException(ErrorMessages.notFound('Salon'));

    if (salon.config)
      throw new ConflictException(VALIDATION_MESSAGES.PAYMENT_CONFIG_CONFLICT);

    if (
      dto.depositType === DepositType.PERCENTAGE &&
      (dto.depositValue <= MIN_PERCENTAGE_DEPOSIT_VALUE ||
        dto.depositValue >= MAX_PERCENTAGE_DEPOSIT_VALUE)
    )
      throw new InvalidDepositException(
        'Deposit percentage must be between 1 and 100',
      );

    if (
      dto.depositType === DepositType.FIXED &&
      dto.depositValue <= MIN_FIXED_DEPOSIT_VALUE
    )
      throw new InvalidDepositException('Fixed deposit must be greater than 0');

    return await this.prisma.salonPaymentConfig.create({
      data: {
        salonId,
        depositType: dto.depositType,
        depositValue: dto.depositValue,
      },
    });
  }

  async updatePaymentConfig(salonId: string, dto: UpdatePaymentConfigDto) {
    const salon = await this.prisma.salons.findUnique({
      where: { id: salonId },
      include: { config: true },
    });

    if (!salon) throw new NotFoundException(ErrorMessages.notFound('Salon'));

    if (!salon.config)
      throw new NotFoundException(ErrorMessages.notFound('Payment config'));

    if (
      dto.depositType === DepositType.PERCENTAGE &&
      (dto.depositValue <= MIN_PERCENTAGE_DEPOSIT_VALUE ||
        dto.depositValue >= MAX_PERCENTAGE_DEPOSIT_VALUE)
    )
      throw new InvalidDepositException(
        'Deposit percentage must be between 1 and 100',
      );

    if (
      dto.depositType === DepositType.FIXED &&
      dto.depositValue <= MIN_FIXED_DEPOSIT_VALUE
    )
      throw new InvalidDepositException('Fixed deposit must be greater than 0');

    return await this.prisma.salonPaymentConfig.update({
      where: { salonId },
      data: {
        depositType: dto.depositType,
        depositValue: dto.depositValue,
      },
    });
  }

  async findNearbySalons(userId: string): Promise<SalonListResponseDto[]> {
    const { lat, lng } = await this.usersService.findUserLocation(userId);

    const center = { latitude: lat, longitude: lng };
    const [min, max] = getBoundsOfDistance(center, 10000);

    const where: any = STATUS_FILTER;

    where.lat = { gte: min.latitude, lte: max.latitude };
    where.lng = { gte: min.longitude, lte: max.longitude };

    const salons = await this.prisma.salons.findMany({
      where,
      include: SALON_LIST_INCLUDE,
    });

    const favorites = await resolveFavorites(userId);

    return salons
      .filter((salon) => {
        if (salon.lat == null || salon.lng == null) return false;

        return isPointWithinRadius(
          {
            latitude: salon.lat,
            longitude: salon.lng,
          },
          center,
          RADIUS_METERS,
        );
      })
      .map((salon) => this.mapper.mapSalonListItem(salon, favorites));
  }

  async findNewestSalons(
    { page, limit }: PaginationQueryDto,
    userId?: string,
  ): Promise<PaginatedResponse<SalonListResponseDto>> {
    const newestSalons = await paginate({
      model: this.prisma.salons,
      orderBy: { createdAt: 'desc' },
      page,
      limit,
      include: SALON_LIST_INCLUDE,
    });

    const favorites = await resolveFavorites(userId);

    return {
      ...newestSalons,
      results: newestSalons.results.map((salon: SalonsWithReviews) =>
        this.mapper.mapSalonListItem(salon, favorites),
      ),
    };
  }

  async findPopularSalons(
    { page, limit }: PaginationQueryDto,
    userId?: string,
  ): Promise<PaginatedResponse<SalonListResponseDto>> {
    const popularSalons = await paginate({
      model: this.prisma.salons,
      where: STATUS_FILTER,
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
      page,
      limit,
      include: SALON_LIST_INCLUDE,
    });

    const favorites = await resolveFavorites(userId);

    return {
      ...popularSalons,
      results: popularSalons.results.map((salon: SalonsWithReviews) =>
        this.mapper.mapSalonListItem(salon, favorites),
      ),
    };
  }

  async getFavoriteSalonIds(userId: string): Promise<Set<string>> {
    const favoriteSalons = await this.prisma.favorites.findMany({
      where: { userId },
      select: { salonId: true },
    });

    return new Set(favoriteSalons.map((f) => f.salonId));
  }

  async findAvailableSalons(date: string, serviceId: string, city?: string) {
    const salons = await this.prisma.salons.findMany({
      where: {
        status: SalonStatus.ACTIVE,
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
        services: {
          some: { id: serviceId, isActive: true },
        },
      },
      include: {
        ...SALON_LIST_INCLUDE,
        employees: {
          where: { isActive: true },
          include: { workingHours: true },
        },
        services: {
          where: { id: serviceId },
        },
      },
    });

    const availableSalons: typeof salons = [];

    for (const salon of salons) {
      const dateSalon = new Date(date);
      const dayOfWeek = dateSalon.getDay();

      for (const employee of salon.employees) {
        const worksToday = employee.workingHours.some(
          (wh) => wh.dayOfWeek == dayOfWeek,
        );

        if (worksToday) {
          availableSalons.push(salon);
          break;
        }
      }
    }
    return availableSalons;
  }
}
