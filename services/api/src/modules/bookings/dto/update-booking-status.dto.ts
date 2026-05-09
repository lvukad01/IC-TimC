import { BookingStatus } from '@lumii/types';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateBookingStatusRequest } from '@lumii/types';

export class UpdateBookingStatusDto implements UpdateBookingStatusRequest {
  @ApiProperty({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
