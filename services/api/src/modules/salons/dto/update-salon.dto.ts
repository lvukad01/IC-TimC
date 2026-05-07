import { ApiPropertyOptional } from '@nestjs/swagger';
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
} from '@lumii/types';
import { IsString, Length, Matches, IsOptional } from 'class-validator';

export class UpdateSalonDto {
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
    message: 'Invalid zipcode format',
  })
  @IsOptional()
  zipcode?: string;

  @ApiPropertyOptional({ example: 'Croatia' })
  @IsString()
  @Length(MIN_COUNTRY_LENGTH, MAX_COUNTRY_LENGTH)
  @IsOptional()
  country?: string;
}
