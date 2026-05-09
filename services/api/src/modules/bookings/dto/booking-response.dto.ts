import { BookingResponse, BookingStatus } from '@lumia/types';
import { ApiProperty } from '@nestjs/swagger';

export class BookingResponseDto implements BookingResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  salonId: string;

  @ApiProperty()
  serviceId: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty()
  createdAt: string;
}
