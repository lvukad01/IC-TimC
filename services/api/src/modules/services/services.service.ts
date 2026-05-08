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
        salonId: salonId,
        categoryId: categoryId,
      },
    });
  }

  async getServiceById(salonId: string, categoryId: string, serviceId: string) {
    const service = await this.prisma.services.findFirst({
      where: {
        id: serviceId,
        salonId: salonId,
        categoryId: categoryId,
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
        durationMin: addServiceDto.durationMin,
        isActive: addServiceDto.isActive,
        salonId: salonId,
        categoryId: categoryId,
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
        durationMin: updateServiceDto.durationMin || service.durationMin,
        isActive: updateServiceDto.isActive || service.isActive,
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
