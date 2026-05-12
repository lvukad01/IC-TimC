import { GeocodingService } from '@geocoding/geocoding.service';
import { AUTH_MESSAGES } from '@lumii/messages';
import { UserRole } from '@lumii/types';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from '@tstypes/access-token';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcrypt';

import { Users } from '@prisma/client';
import { AccessTokenDto } from './dto/access-token.dto';
import { CheckMailResponseDto } from './dto/check-mail-response.dto';
import { MeResponseDto } from './dto/me-response-dto';
import { RegisterRequestDto } from './dto/register-request.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly geocodingService: GeocodingService,
  ) {}

  async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);

    return user;
  }

  async login(user: Users): Promise<AccessTokenDto> {
    const payload: AccessTokenPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDto): Promise<AccessTokenDto> {
    const existingUser = await this.usersService.findOneByEmailWithoutThrow(
      user.email,
    );
    if (existingUser) {
      throw new ConflictException(AUTH_MESSAGES.EMAIL_EXISTS);
    }

    let coordinates;
    if (user.role === UserRole.CLIENT)
      coordinates = await this.geocodingService.geocode({
        street: user.street!,
        city: user.city!,
        zipcode: user.zipcode!,
        country: user.country!,
      });

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
      lat: coordinates.lat,
      lng: coordinates.lng,
    });

    return this.login(newUser);
  }

  getMe(user: AccessTokenPayload): MeResponseDto {
    return {
      id: user.sub,
      email: user.email,
      role: user.role,
    };
  }

  async checkMail(email: string): Promise<CheckMailResponseDto> {
    const user = await this.usersService.findOneByEmailWithoutThrow(email);

    return {
      exists: !!user,
    };
  }
}
