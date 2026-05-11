import { MeResponse, UserRole } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto implements MeResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: UserRole;
}
