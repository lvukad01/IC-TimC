import { SignFilesResponse } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';

export class SignFilesResponseDto implements SignFilesResponse {
  @ApiProperty()
  files: { key: string; url: string }[];
}
