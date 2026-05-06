import { Controller, Get, Put, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import type { UpdateUserDto } from './dto/update-user.dto';
import { RolesAuth } from '@decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'generated/prisma';
import type { RequestWithJwtUser } from '@tstypes/request-types';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get profile of the logged-in user' })
  getProfile(@Req() req: RequestWithJwtUser) {
    return this.usersService.findOne(req.user.sub);
  }

  @Put('me')
  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update profile and address' })
  updateProfile(
    @Req() req: RequestWithJwtUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.sub, updateUserDto);
  }
}
