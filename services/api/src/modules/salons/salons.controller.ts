import { RolesAuth } from '@decorators/auth.decorator';
import { UserRole } from '@lumii/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { RequestWithJwtUser } from '@tstypes/request-types';
import { AddCategoryDto } from './dto/add-category.dto';
import type { CreateSalonDto } from './dto/create-salon.dto';
import {
  SalonDetailResponseDto,
  SalonListResponseDto,
} from './dto/salon-response.dto';
import type { UpdateSalonDto } from './dto/update-salon.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UploadMediaDto } from './dto/upload-media.dto';
import { SalonsService } from './salons.service';

@ApiTags('salons')
@ApiBearerAuth()
@Controller('salons')
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all salons' })
  @ApiOkResponse({ type: SalonListResponseDto, isArray: true })
  getAllSalons(
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('category') category?: string,
  ) {
    return this.salonsService.findAll(search, city, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get salon by ID' })
  @ApiOkResponse({ type: SalonDetailResponseDto })
  getSalonById(@Param('id') id: string) {
    return this.salonsService.getSalonById(id);
  }

  @Post('')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Create a new salon' })
  createSalon(
    @Body() createSalonDto: CreateSalonDto,
    @Request() req: RequestWithJwtUser,
  ) {
    return this.salonsService.createSalon(req.user.sub, createSalonDto);
  }

  @Patch(':id')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Update salon details' })
  updateSalon(@Param('id') id: string, @Body() updateSalonDto: UpdateSalonDto) {
    return this.salonsService.updateSalon(id, updateSalonDto);
  }

  @Delete(':id')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Delete a salon' })
  deleteSalon(@Param('id') id: string) {
    return this.salonsService.deleteSalon(id);
  }

  @Post(':id/media')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Upload media for a salon' })
  uploadSalonMedia(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadMediaDto: UploadMediaDto,
  ) {
    return this.salonsService.uploadMedia(id, file, uploadMediaDto);
  }

  @Delete(':id/media/:mediaId')
  @RolesAuth(UserRole.SALON_OWNER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Delete media from a salon' })
  deleteSalonMedia(@Param('id') id: string, @Param('mediaId') mediaId: string) {
    return this.salonsService.deleteMedia(id, mediaId);
  }

  @Post(':id/categories')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Add category to a salon' })
  addSalonCategory(
    @Param('id') id: string,
    @Body() addCategoryDto: AddCategoryDto,
  ) {
    return this.salonsService.addCategory(id, addCategoryDto);
  }

  @Delete(':id/categories/:categoryId')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Remove category from a salon' })
  removeSalonCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.salonsService.removeCategory(id, categoryId);
  }

  @Get('pending')
  @RolesAuth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all pending salons' })
  getPendingSalons() {
    return this.salonsService.findPendingSalons();
  }

  @Patch(':id/status')
  @RolesAuth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update salon status' })
  updateSalonStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.salonsService.updateStatus(id, updateStatusDto);
  }
}
