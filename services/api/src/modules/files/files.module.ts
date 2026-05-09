import { Module } from '@nestjs/common';
import { S3Module } from '@s3/s3.module';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesModule],
  providers: [FilesService],
  imports: [S3Module],
})
export class FilesModule {}
