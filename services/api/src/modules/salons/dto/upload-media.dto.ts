import { MediaType, UploadMediaRequest } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UploadMediaDto implements UploadMediaRequest {
  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  type: MediaType;

  sortOrder: number;
}
