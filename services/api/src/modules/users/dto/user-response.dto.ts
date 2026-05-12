import { UserResponse } from '@lumii/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto implements UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  street?: string;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  zipcode?: string;

  @ApiProperty()
  country?: string;
}
