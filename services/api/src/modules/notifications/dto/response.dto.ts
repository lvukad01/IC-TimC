import { NotificationType } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({ description: 'Unique notification ID' })
  id: string;

  @ApiProperty({ description: 'Notification message' })
  content: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  is_read: boolean;

  @ApiProperty({ description: 'Timestamp when the notification was created' })
  createdAt: Date;
}
