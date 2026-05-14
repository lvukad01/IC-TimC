import { ApiProperty } from '@nestjs/swagger';
import { BookingsCountsResponse } from '@lumii/types';

export class TodayBookingsCountResponseDto implements BookingsCountsResponse {
  @ApiProperty({ example: 128 })
  count: number;
}
