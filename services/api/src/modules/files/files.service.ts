import { Injectable } from '@nestjs/common';
import { S3Service } from '@s3/s3.service';
import { SignFilesResponseDto } from './dto/sign-files-response.dto';

@Injectable()
export class FilesService {
  constructor(private readonly s3service: S3Service) {}

  async getSignedUrl(keys: string[]): Promise<SignFilesResponseDto> {
    const files = await Promise.all(
      keys.map(async (key) => ({
        key,
        url: await this.s3service.getSignedUrl(key),
      })),
    );

    return { files };
  }
}
