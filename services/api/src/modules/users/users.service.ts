import { GeocodingService } from '@geocoding/geocoding.service';
import { buildFullAdress, isAddressChanged } from '@helpers/adress-helper';
import { ErrorMessages } from '@lumii/messages';
import { UserRole } from '@lumii/types';
import { toUserResponse } from '@mappers/user-response.mapper';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Coordinates } from '@tstypes/coordinates';
import { CreateUserInput } from '@tstypes/create-user';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geocodingService: GeocodingService,
  ) {}

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(ErrorMessages.notFound('User'));
    return toUserResponse(user);
  }

  async findUserLocation(id: string): Promise<Coordinates> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(ErrorMessages.notFound('User'));
    if (user.role === UserRole.SALON_OWNER)
      throw new BadRequestException('Salon owner does not have user location');

    if (!user.city || !user.street || !user.zipcode || !user.country)
      throw new BadRequestException('User does not have full location');

    return await this.geocodingService.geocode({
      street: user.street,
      zipcode: user.zipcode,
      city: user.city,
      country: user.country,
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(ErrorMessages.notFound('User'));
    }
    return user;
  }

  async findOneByEmailWithoutThrow(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });
    return user;
  }

  async create(data: CreateUserInput) {
    return this.prisma.users.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        street: data.street ?? undefined,
        city: data.city ?? undefined,
        zipcode: data.zipcode ?? undefined,
        country: data.country ?? undefined,
        password: data.password,
        role: data.role,
      },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(ErrorMessages.notFound('User'));
    }

    if (updateUserDto.email) {
      const user = await this.findOneByEmailWithoutThrow(id);
      if (user) throw new ConflictException('Email already exists');
    }

    const isClient = user.role === UserRole.CLIENT;

    let coordinates: { lat: number; lng: number } | undefined;

    if (isClient) {
      const existingAddress = {
        street: user.street ?? '',
        city: user.city ?? '',
        zipcode: user.zipcode ?? '',
        country: user.country ?? '',
      };

      const addressChanged = isAddressChanged(updateUserDto);

      if (addressChanged) {
        const mergedAddress = buildFullAdress(updateUserDto, existingAddress);
        coordinates = await this.geocodingService.geocode(mergedAddress);
      }
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        ...updateUserDto,
        ...(coordinates && {
          lat: coordinates.lat,
          lng: coordinates.lng,
        }),
      },
    });

    return toUserResponse(updatedUser);
  }
}
