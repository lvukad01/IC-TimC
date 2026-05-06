import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Salon ljepote', required: true })
  @IsString()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Zagreb', required: true })
  @IsString()
  @Length(MIN_CITY_LENGTH, MAX_CITY_LENGTH)
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Ilica 123', required: true })
  @IsString()
  @Length(MIN_STREET_LENGTH, MAX_STREET_LENGTH)
  @IsOptional()
  street?: string;

  @ApiProperty({ example: '21000', required: true })
  @IsString()
  @Matches(zipcodeRegex, {
    message: 'Invalid zipcode format',
  })
  @IsOptional()
  postalcode?: string;

  @ApiProperty({ example: 'Croatia', required: true })
  @IsString()
  @Length(MIN_COUNTRY_LENGTH, MAX_COUNTRY_LENGTH)
  @IsOptional()
  country?: string;
}
