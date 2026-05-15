import { ActionResponseDto, PaginationQueryDto } from '@common/common';
import { InvalidDepositException } from '@exceptions/salon.exception';
import { FavoritesService } from '@favorites/favorites.service';
import { GeocodingService } from '@geocoding/geocoding.service';
import { buildFullAdress, isAddressChanged } from '@helpers/adress-helper';
import { ErrorMessages, VALIDATION_MESSAGES } from '@lumii/messages';
import {
  BookingStatus,
  DepositType,
  MAX_PERCENTAGE_DEPOSIT_VALUE,
  MediaType,
  MIN_FIXED_DEPOSIT_VALUE,
  MIN_PERCENTAGE_DEPOSIT_VALUE,
  SalonStatus,
  UserRole,
} from '@lumii/types';
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SalonPaymentConfig } from '@prisma/client';
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
import { SalonCategory } from 'generated/prisma';

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
  categories: true,
} as const;

const getStatusFilter = () => ({ status: SalonStatus.ACTIVE });

@Injectable()
export class SalonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geocodingService: GeocodingService,
    private readonly s3Service: S3Service,
    private readonly mapper: SalonsMapper,
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(
    {
      search,
      city,
      category,
      page,
      limit,
      date,
      time,
      serviceId,
    }: FindSalonsQueryDto,
    userId?: string,
  ): Promise<PaginatedResponse<SalonListResponseDto>> {
    if ((date || time) && !serviceId) {
      throw new BadRequestException(
        'serviceId is required when filtering by date and time',
      );
    }

    if (date && time && serviceId) {
      const availableSalons = await this.findAvailableSalons(
        `${date}T${time}:00`,
        serviceId,
        city,
        category,
      );

      const favorites = await this.resolveFavorites(userId);

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

    const where: any = getStatusFilter();

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (category) {
      where.categories = {
        some: { category },
      };
    }

    const salons = await paginate({
      model: this.prisma.salons,
      where,
      page,
      limit,
      include: SALON_LIST_INCLUDE,
    });

    const favorites = await this.resolveFavorites(userId);

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
      where: { id, ...getStatusFilter() },
      include: { media: true, categories: true },
    });
    if (!salon) {
      throw new NotFoundException(ErrorMessages.notFound('Salon'));
    }

    const favorites = await this.resolveFavorites(userId);

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

    const favorites = await this.resolveFavorites(userId);

    return pendingSalons.map((salon) =>
      this.mapper.mapSalonListItem(salon, favorites),
    );
  }

  async createPaymentConfig(salonId: string, dto: CreatePaymentConfigDto) {
    const config = await this.getSalonPaymentConfig(salonId);

    if (config)
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
    const config = await this.getSalonPaymentConfig(salonId);

    if (!config)
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

    const where: any = getStatusFilter();

    where.lat = { gte: min.latitude, lte: max.latitude };
    where.lng = { gte: min.longitude, lte: max.longitude };

    const salons = await this.prisma.salons.findMany({
      where,
      include: SALON_LIST_INCLUDE,
    });

    const favorites = await this.resolveFavorites(userId);

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
      where: getStatusFilter(),
      orderBy: { createdAt: 'desc' },
      page,
      limit,
      include: SALON_LIST_INCLUDE,
    });

    const favorites = await this.resolveFavorites(userId);

    return {
      ...newestSalons,
      results: newestSalons.results.map((salon: SalonsWithReviews) =>
        this.mapper.mapSalonListItem(salon, favorites),
      ),
    };
  }

  async findRecommendedSalons(
    { page, limit }: PaginationQueryDto,
    userId?: string,
  ): Promise<PaginatedResponse<SalonListResponseDto>> {
    const salons = await paginate({
      model: this.prisma.salons,
      where: getStatusFilter(),
      page,
      limit,
      include: SALON_LIST_INCLUDE,
    });

    const favorites = await this.resolveFavorites(userId);

    const mapped = salons.results
      .map((salon: SalonsWithReviews) =>
        this.mapper.mapSalonListItem(salon, favorites),
      )
      .sort((a, b) => b.avgRating - a.avgRating);

    return {
      ...salons,
      results: mapped,
    };
  }

  async findPopularSalons(
    { page, limit }: PaginationQueryDto,
    userId?: string,
  ): Promise<PaginatedResponse<SalonListResponseDto>> {
    const popularSalons = await paginate({
      model: this.prisma.salons,
      where: getStatusFilter(),
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
      page,
      limit,
      include: SALON_LIST_INCLUDE,
    });

    const favorites = await this.resolveFavorites(userId);

    return {
      ...popularSalons,
      results: popularSalons.results.map((salon: SalonsWithReviews) =>
        this.mapper.mapSalonListItem(salon, favorites),
      ),
    };
  }

  private async resolveFavorites(userId?: string): Promise<Set<string>> {
    if (!userId) return new Set<string>();
    return await this.favoritesService.getFavoriteSalonIds(userId);
  }

  async getSalonPaymentConfig(
    salonId: string,
  ): Promise<SalonPaymentConfig | null> {
    const salon = await this.prisma.salons.findUnique({
      where: { id: salonId },
      include: { config: true },
    });

    if (!salon) {
      throw new NotFoundException('Salon not found');
    }

    return salon.config;
  }

  async findAvailableSalons(
    date: string,
    serviceId: string,
    city?: string,
    category?: SalonCategory,
  ) {
    const requestedStart = new Date(date);

    const service = await this.prisma.services.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException(ErrorMessages.notFound('Service'));
    }

    const requestedEnd = new Date(
      requestedStart.getTime() + service.durationMin * 60 * 1000,
    );

    const salons = await this.prisma.salons.findMany({
      where: {
        status: SalonStatus.ACTIVE,
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
        ...(category && {
          categories: {
            some: { category },
          },
        }),
        services: {
          some: { id: serviceId, isActive: true },
        },
      },
      include: {
        ...SALON_LIST_INCLUDE,
        employees: {
          where: { isActive: true },
          include: {
            workingHours: true,
            bookings: {
              where: {
                startTime: { lt: requestedEnd },
                endTime: { gt: requestedStart },
                status: { not: BookingStatus.CANCELLED },
              },
            },
          },
        },
        services: {
          where: { id: serviceId },
        },
      },
    });

    return salons.filter((salon) =>
      salon.employees.some((employee) => {
        const dayOfWeek = requestedStart.getDay();

        const workingHours = employee.workingHours.find(
          (wh) => wh.dayOfWeek === dayOfWeek,
        );

        if (!workingHours) return false;

        const workStart = new Date(requestedStart);
        const [startHour, startMin] = workingHours.startTime
          .split(':')
          .map(Number);
        workStart.setHours(startHour, startMin, 0, 0);

        const workEnd = new Date(requestedStart);
        const [endHour, endMin] = workingHours.endTime.split(':').map(Number);
        workEnd.setHours(endHour, endMin, 0, 0);

        const isInsideWorkingHours =
          requestedStart >= workStart && requestedEnd <= workEnd;

        const hasNoBookingConflict = employee.bookings.length === 0;

        return isInsideWorkingHours && hasNoBookingConflict;
      }),
    );
  }
}
