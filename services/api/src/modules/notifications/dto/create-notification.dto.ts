import { CreateNotification } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from 'generated/prisma';

export class CreateNotificationDto implements CreateNotification {
  @ApiProperty({ description: 'Content to put into notification' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;
}
