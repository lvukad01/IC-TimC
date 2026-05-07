import { RolesAuth } from '@decorators/auth.decorator';
import { UserRole } from '@lumii/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { type RequestWithJwtUser } from '@tstypes/request-types';
import { ActionResponseDto } from 'src/common/dto/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/response.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @ApiCreatedResponse({
    description: 'Returns success message if notification is created',
    type: ActionResponseDto,
  })
  @Post()
  create(
    @Req() req: RequestWithJwtUser,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const userId = req.user.sub;
    return this.notificationsService.create(userId, createNotificationDto);
  }

  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @Get()
  @ApiOkResponse({
    description: 'Returns all user notifications',
    type: NotificationResponseDto,
  })
  findAll(@Req() req: RequestWithJwtUser) {
    const userId = req.user.sub;
    return this.notificationsService.findAll(userId);
  }

  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @Delete('')
  @ApiOkResponse({
    description: 'Returns success message if notifications are deleted',
    type: ActionResponseDto,
  })
  remove(@Req() req: RequestWithJwtUser) {
    const userId = req.user.sub;
    return this.notificationsService.removeAll(userId);
  }

  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @Patch(':id/read')
  @ApiOkResponse({
    description:
      'Returns success message if all user notification is marked as read',
    type: ActionResponseDto,
  })
  markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithJwtUser,
  ) {
    const userId = req.user.sub;
    return this.notificationsService.markAsRead(id, userId);
  }

  @RolesAuth(UserRole.CLIENT, UserRole.SALON_OWNER, UserRole.ADMIN)
  @Patch(':read-all')
  @ApiOkResponse({
    description:
      'Returns success message if all user notifications are marked as read',
    type: ActionResponseDto,
  })
  markAllAsRead(@Req() req: RequestWithJwtUser) {
    const userId = req.user.sub;
    return this.notificationsService.markAllAsRead(userId);
  }
}
