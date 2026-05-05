import { AccessToken } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto implements AccessToken {
  @ApiProperty({ description: 'Base64 encoded JSON Web Token' })
  access_token: string;
}
