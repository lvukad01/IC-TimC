import { VALIDATION_MESSAGES } from '@lumii/messages';
import {
  MAX_CITY_LENGTH,
  MAX_COUNTRY_LENGTH,
  MAX_STREET_LENGTH,
  MIN_CITY_LENGTH,
  MIN_COUNTRY_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_STREET_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  phoneRegex,
  RegisterRequest,
  UserRole,
  zipcodeRegex,
} from '@lumii/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidName } from '@validators/name.validator';
import { IsStrongPassword } from '@validators/password.validator';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  Length,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterRequestDto implements RegisterRequest {
  @ApiProperty({ description: 'User email, must be unique' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'First name of the user' })
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @IsValidName()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @IsValidName()
  lastName: string;

  @ApiProperty({
    description: `User password, minimum ${MIN_PASSWORD_LENGTH} characters. Must have one at least one character, one number and one special character`,
    minLength: MIN_PASSWORD_LENGTH,
  })
  @MinLength(MIN_PASSWORD_LENGTH)
  @IsStrongPassword()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(phoneRegex, { message: VALIDATION_MESSAGES.INVALID_PHONE_FORMAT })
  phone?: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ValidateIf((o) => o.role === UserRole.CLIENT)
  @IsDefined()
  @ApiProperty({ description: 'Street and number' })
  @Length(MIN_STREET_LENGTH, MAX_STREET_LENGTH)
  street?: string;

  @ValidateIf((o) => o.role === UserRole.CLIENT)
  @IsDefined()
  @ApiProperty({ description: 'City' })
  @Length(MIN_CITY_LENGTH, MAX_CITY_LENGTH)
  city?: string;

  @ValidateIf((o) => o.role === UserRole.CLIENT)
  @IsDefined()
  @ApiProperty({ description: 'Postal code' })
  @Matches(zipcodeRegex, {
    message: VALIDATION_MESSAGES.INVALID_ZIPCODE_FORMAT,
  })
  zipcode?: string;

  @ValidateIf((o) => o.role === UserRole.CLIENT)
  @IsDefined()
  @ApiProperty({ description: 'Country' })
  @Length(MIN_COUNTRY_LENGTH, MAX_COUNTRY_LENGTH)
  country?: string;
}
