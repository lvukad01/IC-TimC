import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsString, Matches } from 'class-validator';
import { dateRegex, AddTimeOffRequest } from '@lumii/types';

export class AddTimeOffDto implements AddTimeOffRequest {
  @ApiProperty({ example: '2023-12-31' })
  @IsDateString()
  @Matches(dateRegex, {
    message: 'Invalid date format',
  })
  start_date: string;

  @ApiProperty({ example: '2023-12-31' })
  @IsDateString()
  @Matches(dateRegex, {
    message: 'Invalid date format',
  })
  end_date: string;

  @ApiPropertyOptional({ example: 'Vacation' })
  @IsString()
  reason?: string;
}
