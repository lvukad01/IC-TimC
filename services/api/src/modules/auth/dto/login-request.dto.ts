import { LoginRequest } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto implements LoginRequest {
  @ApiProperty({ description: 'The email address the user registered with' })
  email: string;

  @ApiProperty({
    description:
      "The user's password. Must match the password used during registration.",
  })
  password: string;
}
