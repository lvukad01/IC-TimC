import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches } from 'class-validator';
import { AddWorkingHoursRequest, timeRegex } from '@lumii/types';

export class AddWorkingHoursDto implements AddWorkingHoursRequest {
  @ApiProperty({ example: '0 for Monday' })
  @IsNumber()
  day_of_week: number;

  @ApiProperty({ example: '9:00' })
  @IsString()
  @Matches(timeRegex, {
    message: 'Invalid time format',
  })
  start_time: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  @Matches(timeRegex, {
    message: 'Invalid time format',
  })
  end_time: string;
}
