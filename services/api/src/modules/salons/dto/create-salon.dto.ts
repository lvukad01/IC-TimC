import {
  CreateSalonRequest,
  MAX_CITY_LENGTH,
  MAX_COUNTRY_LENGTH,
  MAX_STREET_LENGTH,
  MIN_CITY_LENGTH,
  MIN_COUNTRY_LENGTH,
  MIN_STREET_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  SalonCategory,
  zipcodeRegex,
} from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString, Length, Matches } from 'class-validator';

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
    message: 'Invalid zipcode format',
  })
  zipcode: string;

  @ApiProperty({ example: 'Croatia' })
  @IsString()
  @Length(MIN_COUNTRY_LENGTH, MAX_COUNTRY_LENGTH)
  country: string;

  @ApiProperty({
    enum: SalonCategory,
    isArray: true,
    example: ['HAIR', 'NAILS'],
  })
  @IsArray()
  @IsEnum(SalonCategory, { each: true })
  categories: SalonCategory[];
}
