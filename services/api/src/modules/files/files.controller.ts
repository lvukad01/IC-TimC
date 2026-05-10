import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SignFilesResponseDto } from './dto/sign-files-response.dto';
import { SignFilesDto } from './dto/sign-files.dto';

@Controller('files')
export class FilesController {
  @Post('sign')
  @ApiOperation({ summary: 'Get newest valid url for image of a salon' })
  @ApiOkResponse({ type: SignFilesResponseDto })
  async getSignedUrl(@Body() dto: SignFilesDto) {
    return await this.getSignedUrl(dto);
  }
}
