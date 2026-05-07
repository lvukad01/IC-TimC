import { GeocodingService } from '@geocoding/geocoding.service';
import { toUserResponse } from '@mappers/user-response.mapper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from '@tstypes/create-user';
import { PrismaService } from '../prisma/prisma.service';
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

    if (!user) throw new NotFoundException('User not found');
    return toUserResponse(user);
  }

  async findOneByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserInput) {
    return this.prisma.users.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        street: data.street,
        city: data.city,
        zipcode: data.zipcode,
        country: data.country,
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

    const mergedAdress = {
      street: updateUserDto.street ?? user.street,
      city: updateUserDto.city ?? user.city,
      zipcode: updateUserDto.zipcode ?? user.zipcode,
      country: updateUserDto.country ?? user.country,
    };

    const addressChanged =
      updateUserDto.street !== undefined ||
      updateUserDto.city !== undefined ||
      updateUserDto.zipcode !== undefined ||
      updateUserDto.country !== undefined;

    let coordinates;
    if (addressChanged)
      coordinates = await this.geocodingService.geocode(mergedAdress);

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: { ...updateUserDto, ...coordinates },
    });

    return toUserResponse(updatedUser);
  }
}
