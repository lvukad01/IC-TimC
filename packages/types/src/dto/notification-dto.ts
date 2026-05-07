import { NotificationType } from '@enums/enum';

export interface CreateNotification {
  content: string;
  type: NotificationType;
}

export interface NotificationResponseDto {
  id: string;
  content: string;
  type: NotificationType;
  is_read: boolean;
  createdAt: Date;
}
