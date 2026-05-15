import { VALIDATION_MESSAGES } from '@lumii/messages';
import {
  countryCodeRegex,
  MAX_CITY_LENGTH,
  MAX_STREET_LENGTH,
  MIN_CITY_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_STREET_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  phoneRegex,
  UpdateUserRequest,
  zipcodeRegex,
} from '@lumii/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidName } from '@validators/name.validator';
import { IsStrongPassword } from '@validators/password.validator';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUserDto implements UpdateUserRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Lana' })
  @IsOptional()
  @IsString()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @IsValidName()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Ivić' })
  @IsOptional()
  @IsString()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @IsValidName()
  lastName?: string;

  @ApiPropertyOptional({
    description: `User password, minimum ${MIN_PASSWORD_LENGTH} characters. Must have one at least one character, one number and one special character`,
    minLength: MIN_PASSWORD_LENGTH,
  })
  @IsOptional()
  @MinLength(MIN_PASSWORD_LENGTH)
  @IsStrongPassword()
  password?: string;

  @ApiPropertyOptional({ example: '091 234 567' })
  @IsOptional()
  @IsString()
  @Matches(phoneRegex, { message: VALIDATION_MESSAGES.INVALID_PHONE_FORMAT })
  phone?: string;

  @ApiPropertyOptional({ example: 'HR' })
  @IsOptional()
  @Matches(countryCodeRegex, {
    message: VALIDATION_MESSAGES.INVALID_COUNTRY_NAME,
  })
  country?: string;

  @ApiPropertyOptional({ example: 'Zagreb' })
  @IsOptional()
  @IsString()
  @Length(MIN_CITY_LENGTH, MAX_CITY_LENGTH)
  city?: string;

  @ApiPropertyOptional({ example: 'Ilica 123' })
  @IsOptional()
  @IsString()
  @Length(MIN_STREET_LENGTH, MAX_STREET_LENGTH)
  street?: string;

  @ApiPropertyOptional({ example: '21000' })
  @IsOptional()
  @IsString()
  @Matches(zipcodeRegex, {
    message: VALIDATION_MESSAGES.INVALID_ZIPCODE_FORMAT,
  })
  zipcode?: string;
}
