import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SalonStatus } from '@lumii/types';

export class UpdateStatusDto {
  @ApiProperty({
    enum: SalonStatus,
    example: SalonStatus.ACTIVE,
    required: true,
  })
  @IsEnum(SalonStatus)
  status: SalonStatus;
}
