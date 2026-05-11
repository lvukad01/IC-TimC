import { BookingStatus, UpdateBookingStatusRequest } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateBookingStatusDto implements UpdateBookingStatusRequest {
  @ApiProperty({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
