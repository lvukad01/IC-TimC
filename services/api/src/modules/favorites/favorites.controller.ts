import { RolesAuth } from '@decorators/auth.decorator';
import { UserRole } from '@lumii/types';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import type { RequestWithJwtUser } from '@tstypes/request-types';
import { ActionResponseDto } from 'src/common/dto/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @Post(':salonId')
  @ApiCreatedResponse({
    type: ActionResponseDto,
  })
  @ApiOperation({
    summary: 'Adds salon to favorites',
  })
  create(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Req() req: RequestWithJwtUser,
  ) {
    const userId = req.user.sub;
    return this.favoritesService.create(userId, salonId);
  }

  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @Get()
  @ApiOkResponse({
    type: ActionResponseDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Returns all favorite salons of the authenticated user',
  })
  findUserFavorites(@Req() req: RequestWithJwtUser) {
    const userId = req.user.sub;
    return this.favoritesService.findUserFavorites(userId);
  }

  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @Delete(':salonId')
  @ApiOkResponse({
    type: ActionResponseDto,
  })
  @ApiOperation({
    summary: 'Returns id if salon is successfully removed from favorites',
  })
  remove(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Req() req: RequestWithJwtUser,
  ) {
    const userId = req.user.sub;
    return this.favoritesService.remove(userId, salonId);
  }
}
