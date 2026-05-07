import { Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service';
import type { UpdateSalonDto } from './dto/update-salon.dto';
import type { CreateSalonDto } from './dto/create-salon.dto';
import { UserRole } from '@lumii/types';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AddCategoryDto } from './dto/add-category.dto';

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
          zipcode: createSalonDto.zipcode.trim(),
          status: 'PENDING',
        },
      });

      if (createSalonDto.categories?.length) {
        await tx.salon_Categories.createMany({
          data: createSalonDto.categories.map((category) => ({
            salon_id: salon.id,
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
  }

  async addCategory(salonId: string, addCategoryDto: AddCategoryDto) {
    await this.getSalonById(salonId);
    return this.prisma.salon_Categories.create({
      data: {
        salon_id: salonId,
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
    await this.getSalonById(salonId);
    // TODO
  }

  async removeCategory(salonId: string, categoryId: string) {
    await this.getSalonById(salonId);
    return this.prisma.salon_Categories.delete({
      where: { id: categoryId, salon_id: salonId },
    });
  }

  async findPendingSalons() {
    return this.prisma.salons.findMany({ where: { status: 'PENDING' } });
  }
}
