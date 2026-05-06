import { Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service';
import type { UpdateSalonDto } from './dto/update-salon.dto';
import type { CreateSalonDto } from './dto/create-salon.dto';
import { UserRole } from '@lumii/types/dist/enums/enum';

@Injectable()
export class SalonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, city?: string, category?: string) {
    const where: any = { status: 'ACTIVE' };
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
    return this.prisma.salons.findMany({ where });
  }

  async getSalonById(id: string) {
    const salon = await this.prisma.salons.findUnique({ where: { id } });
    if (!salon) {
      throw new NotFoundException('Salon not found');
    }
    return salon;
  }

  async createSalon(userId: string, createSalonDto: CreateSalonDto) {
    return this.prisma.$transaction(async (tx) => {
      const salon = await tx.salons.create({
        data: {
          owner_id: userId,
          name: createSalonDto.name.trim(),
          city: createSalonDto.city.trim(),
          street: createSalonDto.street.trim(),
          country: createSalonDto.country.trim(),
          zipcode: createSalonDto.postalcode.trim(),
          status: 'PENDING',
        },
      });
      await tx.users.update({
        where: { id: userId },
        data: { role: UserRole.SALON_OWNER },
      });
      return salon;
    });
  }

  async updateSalon(id: string, updateSalonDto: UpdateSalonDto) {
    await this.getSalonById(id);
    return this.prisma.salons.update({
      where: { id },
      data: updateSalonDto,
    });
  }

  async deleteSalon(id: string) {
    await this.getSalonById(id);
    return this.prisma.salons.delete({ where: { id } });
  }

  async uploadMedia(salonId: string, media: any) {
    await this.getSalonById(salonId);
    // TODO
  }

  async addCategory(salonId: string, AddCategoryDto: any) {
    await this.getSalonById(salonId);
    // TODO
  }

  async updateStatus(salonId: string, updateStatusDto: any) {
    await this.getSalonById(salonId);
    // TODO
  }

  async deleteMedia(salonId: string, mediaId: string) {
    await this.getSalonById(salonId);
    // TODO
  }

  async deleteCategory(salonId: string, categoryId: string) {
    await this.getSalonById(salonId);
    // TODO
  }

  async removeCategory(salonId: string, categoryId: string) {
    await this.getSalonById(salonId);
    // TODO
  }

  async findPendingSalons() {
    return this.prisma.salons.findMany({ where: { status: 'PENDING' } });
  }
}
