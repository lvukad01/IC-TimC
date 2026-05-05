import {
  AddressType,
  MIN_PASSWORD_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
} from '@cart-app/types';
import { ApiProperty } from '@nestjs/swagger';
import { UserAddressDto } from '@users/dto/user-address.dto';
import { UserCardDto } from '@users/dto/user-card.dto';
import { IsValidName } from '@validators/name.validator';
import { IsStrongPassword } from '@validators/password.validator';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDefined,
  IsEmail,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class RegisterRequestDto {
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

  @ApiProperty({
    type: () => [UserAddressDto],
    default: [
      {
        type: AddressType.BILLING,
        street: '',
        city: 'Virovitica',
        zipcode: '33000',
        country: 'Croatia',
      },
      {
        type: AddressType.SHIPPING,
        street: '',
        city: 'Virovitica',
        zipcode: '33000',
        country: 'Croatia',
      },
    ],
  })
  @IsDefined({ message: 'Address is required' })
  @ValidateNested({ each: true })
  @Type(() => UserAddressDto)
  @ArrayMinSize(2)
  addresses: UserAddressDto[];

  @ApiProperty({ type: () => UserCardDto })
  @IsDefined({ message: 'Card is required' })
  @ValidateNested()
  @Type(() => UserCardDto)
  card: UserCardDto;
}
