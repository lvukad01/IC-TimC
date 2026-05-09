import { AvailabilityResponse } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';

export class AvailabilityResponseDto implements AvailabilityResponse {
  @ApiProperty({ example: '09:00:00' })
  startTime: string;

  @ApiProperty({ example: '17:00:00' })
  endTime: string;
}
