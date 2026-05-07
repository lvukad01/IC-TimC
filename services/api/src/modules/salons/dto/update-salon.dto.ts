import { VALIDATION_MESSAGES } from '@lumii/messages';
import {
  MAX_CITY_LENGTH,
  MAX_COUNTRY_LENGTH,
  MAX_STREET_LENGTH,
  MIN_CITY_LENGTH,
  MIN_COUNTRY_LENGTH,
  MIN_STREET_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  zipcodeRegex,
  UpdateSalonRequest,
} from '@lumii/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateSalonDto implements UpdateSalonRequest {
  @ApiPropertyOptional({ example: 'Salon ljepote' })
  @IsString()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Zagreb' })
  @IsString()
  @Length(MIN_CITY_LENGTH, MAX_CITY_LENGTH)
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Ilica 123' })
  @IsString()
  @Length(MIN_STREET_LENGTH, MAX_STREET_LENGTH)
  @IsOptional()
  street?: string;

  @ApiPropertyOptional({ example: '21000' })
  @IsString()
  @Matches(zipcodeRegex, {
    message: VALIDATION_MESSAGES.INVALID_ZIPCODE_FORMAT,
  })
  @IsOptional()
  zipcode?: string;

  @ApiPropertyOptional({ example: 'Croatia' })
  @IsString()
  @Length(MIN_COUNTRY_LENGTH, MAX_COUNTRY_LENGTH)
  @IsOptional()
  country?: string;
}
