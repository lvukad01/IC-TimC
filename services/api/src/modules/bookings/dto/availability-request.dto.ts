import { AvailabilityRequest, DATETIME_REGEX } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, Matches } from 'class-validator';

export class AvailabilityRequestDto implements AvailabilityRequest {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  serviceId!: string;

  @ApiProperty({ example: '2026-05-10' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Invalid date format, use YYYY-MM-DD',
  })
  date!: string;
}
