import { serviceNameRegex, DURATION_MIN, DURATION_MAX } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  Matches,
  Length,
} from 'class-validator';

export class UpdateServiceDto {
  @ApiProperty({ example: 'haircut' })
  @IsString()
  @Matches(serviceNameRegex, {
    message:
      'Name must be 2-50 characters long and can contain letters, numbers, spaces, hyphens, and apostrophes.',
  })
  name?: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Length(DURATION_MIN, DURATION_MAX)
  durationMin?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive?: boolean;
}
