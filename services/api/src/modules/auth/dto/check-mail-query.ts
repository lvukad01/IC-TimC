import { CheckMailRequest } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';

export class CheckMailQuery implements CheckMailRequest {
  @ApiProperty()
  email: string;
}
