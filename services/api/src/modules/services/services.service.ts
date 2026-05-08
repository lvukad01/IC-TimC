import { PrismaService } from '@prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from '@lumii/messages';
import { AddServiceDto } from './dto/add-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllServices(salonId: string, categoryId: string) {
    return this.prisma.services.findMany({
      where: {
        salon_id: salonId,
        category_id: categoryId,
      },
    });
  }

  async getServiceById(salonId: string, categoryId: string, serviceId: string) {
    const service = await this.prisma.services.findFirst({
      where: {
        id: serviceId,
        salon_id: salonId,
        category_id: categoryId,
      },
    });
    if (!service) {
      throw new NotFoundException(ERROR_MESSAGES.SERVICE_NOT_FOUND);
    }
    return service;
  }
  async addService(
    salonId: string,
    categoryId: string,
    addServiceDto: AddServiceDto,
  ) {
    return this.prisma.services.create({
      data: {
        name: addServiceDto.name,
        price: addServiceDto.price,
        duration_min: addServiceDto.duration_min,
        is_active: addServiceDto.is_active,
        salon_id: salonId,
        category_id: categoryId,
      },
    });
  }
  async updateService(
    salonId: string,
    categoryId: string,
    serviceId: string,
    updateServiceDto: UpdateServiceDto,
  ) {
    const service = await this.getServiceById(salonId, categoryId, serviceId);
    return this.prisma.services.update({
      where: {
        id: serviceId,
      },
      data: {
        name: updateServiceDto.name || service.name,
        price: updateServiceDto.price || service.price,
        duration_min: updateServiceDto.duration_min || service.duration_min,
        is_active: updateServiceDto.is_active || service.is_active,
      },
    });
  }

  async deleteService(salonId: string, categoryId: string, serviceId: string) {
    await this.getServiceById(salonId, categoryId, serviceId);
    return this.prisma.services.delete({
      where: {
        id: serviceId,
      },
    });
  }
}
