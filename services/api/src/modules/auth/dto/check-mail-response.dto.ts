import { CheckMailResponse } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';

export class CheckMailResponseDto implements CheckMailResponse {
  @ApiProperty({ description: 'True if user email exists' })
  exists: boolean;
}
