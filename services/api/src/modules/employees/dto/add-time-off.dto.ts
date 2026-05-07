import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsString, Matches } from 'class-validator';
import { dateRegex } from '@lumii/types';

export class AddTimeOffDto {
  @ApiProperty({ example: '2023-12-31' })
  @IsDateString()
  @Matches(dateRegex, {
    message: 'Invalid date format',
  })
  start_datetime: string;

  @ApiProperty({ example: '2023-12-31' })
  @IsDateString()
  @Matches(dateRegex, {
    message: 'Invalid date format',
  })
  end_datetime: string;

  @ApiPropertyOptional({ example: 'Vacation' })
  @IsString()
  reason?: string;
}
