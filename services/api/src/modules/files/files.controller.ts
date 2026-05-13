import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SignFilesResponseDto } from './dto/sign-files-response.dto';
import { SignFilesDto } from './dto/sign-files.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('sign')
  @ApiOperation({ summary: 'Get newest valid url for image of a salon' })
  @ApiOkResponse({ type: SignFilesResponseDto })
  async getSignedUrl(@Body() dto: SignFilesDto) {
    return await this.filesService.getSignedUrl(dto.keys);
  }
}
