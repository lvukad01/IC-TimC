import { CreateBookingRequest, DATETIME_REGEX } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, Matches } from 'class-validator';

export class CreateBookingDto implements CreateBookingRequest {
  @IsUUID()
  serviceId: string;

  @IsUUID()
  employeeId: string;

  @ApiProperty({ example: '2026-12-31T23:59:00Z' })
  @Matches(DATETIME_REGEX, {})
  startTime: string;

  @ApiProperty({ example: '2027-01-01T00:29:00Z' })
  @Matches(DATETIME_REGEX, {})
  endTime: string;
}
