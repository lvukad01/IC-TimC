import { VALIDATION_MESSAGES } from '@lumii/messages';
import {
  countryCodeRegex,
  CreateSalonRequest,
  MAX_CITY_LENGTH,
  MAX_STREET_LENGTH,
  MIN_CITY_LENGTH,
  MIN_STREET_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  SalonCategory,
  zipcodeRegex,
} from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateSalonDto implements CreateSalonRequest {
  @ApiProperty({ example: 'Salon ljepote' })
  @IsString()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({ example: 'Zagreb' })
  @IsString()
  @Length(MIN_CITY_LENGTH, MAX_CITY_LENGTH)
  city: string;

  @ApiProperty({ example: 'Ilica 123' })
  @IsString()
  @Length(MIN_STREET_LENGTH, MAX_STREET_LENGTH)
  street: string;

  @ApiProperty({ example: '21000' })
  @IsString()
  @Matches(zipcodeRegex, {
    message: VALIDATION_MESSAGES.INVALID_ZIPCODE_FORMAT,
  })
  zipcode: string;

  @ApiProperty({ example: 'HR' })
  @Matches(countryCodeRegex, {
    message: VALIDATION_MESSAGES.INVALID_COUNTRY_NAME,
  })
  country: string;

  @ApiProperty({
    enum: SalonCategory,
    isArray: true,
    example: ['HAIR', 'NAILS'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(SalonCategory, { each: true })
  categories: SalonCategory[];
}
