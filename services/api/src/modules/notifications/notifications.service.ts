import { NotificationResponseDto, SortOrder } from '@lumii/types';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ActionResponseDto } from 'src/common/dto/common';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateNotificationDto,
  ): Promise<ActionResponseDto> {
    const notification = await this.prisma.notifications.create({
      data: { content: dto.content, userId: userId, type: dto.type },
    });

    return {
      message: 'Notification successfully created',
      id: notification.id,
    };
  }

  async removeOne(
    notificationId: string,
    userId: string,
  ): Promise<ActionResponseDto> {
    const deletedNotification = await this.prisma.notifications.delete({
      where: { id: notificationId, userId: userId },
    });

    return {
      id: deletedNotification.id,
      message: 'Notification successfully deleted',
    };
  }

  async removeAll(userId: string): Promise<ActionResponseDto> {
    await this.prisma.notifications.deleteMany({ where: { userId: userId } });

    return { message: 'Notifications successfully deleted' };
  }

  async findAll(userId: string): Promise<NotificationResponseDto[]> {
    return await this.prisma.notifications.findMany({
      where: { userId: userId },
      orderBy: { createdAt: SortOrder.desc },
    });
  }

  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<ActionResponseDto> {
    const updatedNotification = await this.prisma.notifications.update({
      where: { id: notificationId, userId: userId },
      data: { isRead: true },
    });

    return {
      message: 'Notification marked as read',
      id: updatedNotification.id,
    };
  }

  async markAllAsRead(userId: string): Promise<ActionResponseDto> {
    await this.prisma.notifications.updateMany({
      where: { userId: userId, isRead: false },
      data: { isRead: true },
    });

    return {
      message: 'Notifications marked as read',
    };
  }
}
