import { BookingResponse, BookingStatus } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';

class BookingSalonDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  city: string;
}

class BookingServiceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

class BookingEmployeeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

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

  @ApiProperty({ type: BookingSalonDto, required: false })
  salon?: BookingSalonDto;

  @ApiProperty({ type: BookingServiceDto, required: false })
  service?: BookingServiceDto;

  @ApiProperty({ type: BookingEmployeeDto, required: false })
  employee?: BookingEmployeeDto;
}
