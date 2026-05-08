import { GeocodingService } from '@geocoding/geocoding.service';
import { buildFullAdress, isAddressChanged } from '@helpers/adress-helper';
import { MediaType, SalonStatus, UserRole } from '@lumii/types';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from '@lumii/messages';
import { S3Service } from '@s3/s3.service';
import type { PrismaService } from '../prisma/prisma.service';
import { AddCategoryDto } from './dto/add-category.dto';
import { CreateSalonDto } from './dto/create-salon.dto';
import {
  SalonDetailResponseDto,
  SalonListResponseDto,
} from './dto/salon-response.dto';
import type { UpdateSalonDto } from './dto/update-salon.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UploadMediaDto } from './dto/upload-media.dto';
import { SalonsMapper } from './mapper/salons.mapper';

@Injectable()
export class SalonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geocodingService: GeocodingService,
    private readonly s3Service: S3Service,
    private readonly mapper: SalonsMapper,
  ) {}

  async findAll(
    search?: string,
    city?: string,
    category?: string,
  ): Promise<SalonListResponseDto[]> {
    const where: any = { status: SalonStatus.ACTIVE };
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
    const salons = await this.prisma.salons.findMany({
      where,
      include: {
        media: true,
      },
    });

    return Promise.all(
      salons.map((salon) => this.mapper.mapSalonListItem(salon)),
    );
  }

  async getSalonById(id: string): Promise<SalonDetailResponseDto> {
    const salon = await this.prisma.salons.findUnique({
      where: { id },
      include: { media: true },
    });
    if (!salon) {
      throw new NotFoundException(ERROR_MESSAGES.SALON_NOT_FOUND);
    }

    return this.mapper.mapSalonDetails(salon);
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
          name: createSalonDto.name.trim(),
          city: createSalonDto.city.trim(),
          street: createSalonDto.street.trim(),
          country: createSalonDto.country.trim(),
          zipcode: createSalonDto.zipcode.trim(),
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

    if (!salon) throw new NotFoundException('Salon not found');

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

    if (!salon) throw new NotFoundException('Salon not found');

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

  async deleteMedia(salonId: string, mediaId: string) {
    const media = await this.prisma.salonMedia.findFirst({
      where: { id: mediaId, salonId: salonId },
    });

    if (!media) throw new NotFoundException('Media not found');

    await this.prisma.salonMedia.delete({
      where: { id: mediaId },
    });

    await this.s3Service.deleteFile(media.key);

    return {
      id: mediaId,
      message: 'Media deleted successfully',
    };
  }

  async removeCategory(salonId: string, categoryId: string) {
    await this.getSalonById(salonId);
    return this.prisma.salonCategories.delete({
      where: { id: categoryId, salonId: salonId },
    });
  }

  async findPendingSalons(): Promise<SalonListResponseDto[]> {
    const pendingSalons = await this.prisma.salons.findMany({
      where: { status: SalonStatus.PENDING },
      include: { media: true },
    });

    return Promise.all(
      pendingSalons.map((salon) => this.mapper.mapSalonListItem(salon)),
    );
  }
}
