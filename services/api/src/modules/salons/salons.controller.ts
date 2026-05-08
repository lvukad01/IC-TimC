import { ActionResponseDto } from '@common/common';
import { RolesAuth } from '@decorators/auth.decorator';
import { UserRole } from '@lumii/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { RequestWithJwtUser } from '@tstypes/request-types';
import { AddCategoryDto } from './dto/add-category.dto';
import { CreatePaymentConfigDto } from './dto/create-payment-config.dto';
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
  getSalonById(@Param('id', ParseUUIDPipe) id: string) {
    return this.salonsService.getSalonById(id);
  }

  @Post('')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Create a new salon' })
  @ApiCreatedResponse({ type: SalonDetailResponseDto })
  createSalon(
    @Body() createSalonDto: CreateSalonDto,
    @Request() req: RequestWithJwtUser,
  ) {
    return this.salonsService.createSalon(req.user.sub, createSalonDto);
  }

  @Patch(':id')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Update salon details' })
  @ApiOkResponse({ type: SalonDetailResponseDto })
  updateSalon(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSalonDto: UpdateSalonDto,
  ) {
    return this.salonsService.updateSalon(id, updateSalonDto);
  }

  @Delete(':id')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Delete a salon' })
  @ApiOkResponse({
    description: 'Salon deleted successfully',
    type: ActionResponseDto,
  })
  deleteSalon(@Param('id', ParseUUIDPipe) id: string) {
    return this.salonsService.deleteSalon(id);
  }

  @Post(':id/media')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Upload media for a salon' })
  uploadSalonMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadMediaDto: UploadMediaDto,
  ) {
    return this.salonsService.uploadMedia(id, file, uploadMediaDto);
  }

  @Delete(':id/media/:mediaId')
  @RolesAuth(UserRole.SALON_OWNER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Delete media from a salon' })
  @ApiOkResponse({
    description: 'Media deleted successfully',
    type: ActionResponseDto,
  })
  deleteSalonMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    return this.salonsService.deleteMedia(id, mediaId);
  }

  @Post(':id/categories')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Add category to a salon' })
  @ApiCreatedResponse({ description: 'Category added successfully' })
  addSalonCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addCategoryDto: AddCategoryDto,
  ) {
    return this.salonsService.addCategory(id, addCategoryDto);
  }

  @Delete(':id/categories/:categoryId')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Remove category from a salon' })
  @ApiOkResponse({
    description: 'Category removed successfully',
    type: ActionResponseDto,
  })
  removeSalonCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
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
  @ApiOkResponse({ description: 'Salon status updated successfully' })
  updateSalonStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.salonsService.updateStatus(id, updateStatusDto);
  }

  @Post(':id/paymentConfig')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Add payment config to a salon' })
  @ApiCreatedResponse({ description: 'Payment config created successfully' })
  addSalonPaymentConfig(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreatePaymentConfigDto,
  ) {
    return this.salonsService.createPaymentConfig(id, dto);
  }

  @Patch(':id/paymentConfig')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Add payment config to a salon' })
  @ApiCreatedResponse({ description: 'Payment config updated successfully' })
  updateSalonPaymentConfig(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentConfigDto,
  ) {
    return this.salonsService.updatePaymentConfig(id, dto);
  }
}
