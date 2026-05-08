import { GeocodingService } from '@geocoding/geocoding.service';
import { buildFullAdress, isAddressChanged } from '@helpers/adress-helper';
import { ErrorMessages } from '@lumii/messages';
import { toUserResponse } from '@mappers/user-response.mapper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
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

  async findOneByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(ErrorMessages.notFound('User'));
    }
    return user;
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

    if (!user) throw new NotFoundException(ErrorMessages.notFound('User'));

    const existingAddress = {
      street: user.street,
      city: user.city,
      zipcode: user.zipcode,
      country: user.country,
    };

    const mergedAdress = buildFullAdress(updateUserDto, existingAddress);
    const addressChanged = isAddressChanged(updateUserDto);

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
