import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto implements AccessTokenDto {
  @ApiProperty({ description: 'Base64 encoded JSON Web Token' })
  access_token: string;
}
