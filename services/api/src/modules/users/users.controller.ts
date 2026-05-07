import { RolesAuth } from '@decorators/auth.decorator';
import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { RequestWithJwtUser } from '@tstypes/request-types';
import { UserRole } from 'generated/prisma';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get profile of the logged-in user' })
  @ApiOkResponse({ type: UserResponseDto })
  getProfile(@Req() req: RequestWithJwtUser) {
    return this.usersService.findOne(req.user.sub);
  }

  @Put('me')
  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update profile and address' })
  @ApiOkResponse({ type: UserResponseDto })
  updateProfile(
    @Req() req: RequestWithJwtUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.sub, updateUserDto);
  }
}
