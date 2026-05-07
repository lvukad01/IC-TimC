import { VALIDATION_MESSAGES } from '@lumii/messages';
import {
  MAX_CITY_LENGTH,
  MAX_STREET_LENGTH,
  MIN_CITY_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_STREET_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  phoneRegex,
  zipcodeRegex,
} from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidName } from '@validators/name.validator';
import { IsStrongPassword } from '@validators/password.validator';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Lana', required: false })
  @IsOptional()
  @IsString()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @IsValidName()
  firstName?: string;

  @ApiProperty({ example: 'Ivić', required: false })
  @IsOptional()
  @IsString()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @IsValidName()
  lastName?: string;

  @ApiProperty({
    description: `User password, minimum ${MIN_PASSWORD_LENGTH} characters. Must have one at least one character, one number and one special character`,
    minLength: MIN_PASSWORD_LENGTH,
  })
  @IsOptional()
  @MinLength(MIN_PASSWORD_LENGTH)
  @IsStrongPassword()
  password?: string;

  @ApiProperty({ example: '091 234 567', required: false })
  @IsOptional()
  @IsString()
  @Matches(phoneRegex, { message: VALIDATION_MESSAGES.INVALID_PHONE_FORMAT })
  phone?: string;

  @ApiProperty({ example: 'Croatia', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'Zagreb', required: false })
  @IsOptional()
  @IsString()
  @Length(MIN_CITY_LENGTH, MAX_CITY_LENGTH)
  city?: string;

  @ApiProperty({ example: 'Ilica 123', required: false })
  @IsOptional()
  @IsString()
  @Length(MIN_STREET_LENGTH, MAX_STREET_LENGTH)
  street?: string;

  @ApiProperty({ example: '21000', required: false })
  @IsOptional()
  @IsString()
  @Matches(zipcodeRegex, {
    message: VALIDATION_MESSAGES.INVALID_ZIPCODE_FORMAT,
  })
  zipcode?: string;
}
