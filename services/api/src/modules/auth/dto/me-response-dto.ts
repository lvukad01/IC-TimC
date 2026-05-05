import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({ description: 'True if user is authenticated' })
  isLoggedIn: boolean;

  @ApiProperty({ description: 'True if user is authenticated and admin' })
  isAdmin: boolean;
}
