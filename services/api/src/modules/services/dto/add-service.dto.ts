import {
  AddServiceRequest,
  DURATION_MIN,
  DURATION_MAX,
  serviceNameRegex,
} from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  Length,
  Matches,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '@lumii/messages';

export class AddServiceDto implements AddServiceRequest {
  @ApiProperty({ example: 'haircut' })
  @IsString()
  @Matches(serviceNameRegex, {
    message: VALIDATION_MESSAGES.INVALID_SERVICE_NAME,
  })
  name: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Length(DURATION_MIN, DURATION_MAX)
  durationMin: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;
}
