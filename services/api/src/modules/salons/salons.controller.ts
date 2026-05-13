import { ActionResponseDto, PaginationQueryDto } from '@common/common';
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
  Req,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerPaginatedApiResponse } from '@response/paginated-response.dto';
import type {
  RequestWithJwtUser,
  RequestWithOptionalUser,
} from '@tstypes/request-types';
import 'multer';
import { AddCategoryDto } from './dto/add-category.dto';
import { CreatePaymentConfigDto } from './dto/create-payment-config.dto';
import { CreateSalonDto } from './dto/create-salon.dto';
import { FindSalonsQueryDto } from './dto/find-salons-query.dto';
import {
  SalonDetailResponseDto,
  SalonListResponseDto,
} from './dto/salon-response.dto';
import { UpdatePaymentConfigDto } from './dto/update-payment-config.dto';
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
  @ApiOkResponse({
    type: SwaggerPaginatedApiResponse(
      SalonListResponseDto,
      'SalonListResponseDto',
    ),
  })
  @ApiQuery({ type: FindSalonsQueryDto })
  getAllSalons(
    @Query() query: FindSalonsQueryDto,
    @Req() req: RequestWithOptionalUser,
  ) {
    return this.salonsService.findAll(query, req.user?.sub);
  }

  @Get('pending')
  @RolesAuth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all pending salons' })
  getPendingSalons(@Req() req: RequestWithJwtUser) {
    return this.salonsService.findPendingSalons(req.user.sub);
  }

  @Get('nearby')
  @RolesAuth(UserRole.SALON_OWNER, UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get salons in 1km radius' })
  @ApiOkResponse({ type: SalonListResponseDto, isArray: true })
  findNearbySalons(@Req() req: RequestWithJwtUser) {
    return this.salonsService.findNearbySalons(req.user.sub);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get most popular salons based on booking count' })
  @ApiOkResponse({
    type: SwaggerPaginatedApiResponse(
      SalonListResponseDto,
      'SalonListResponseDto',
    ),
  })
  findPopularSalons(
    @Query() dto: PaginationQueryDto,
    @Req() req: RequestWithOptionalUser,
  ) {
    console.log('POPULAR ENDPOINT HIT', dto);

    return this.salonsService.findPopularSalons(dto, req.user?.sub);
  }

  @Get('newest')
  @ApiOperation({ summary: 'Get newest added salons' })
  @ApiOkResponse({
    type: SwaggerPaginatedApiResponse(
      SalonListResponseDto,
      'SalonListResponseDto',
    ),
  })
  findNewestSalons(
    @Query() dto: PaginationQueryDto,
    @Req() req: RequestWithOptionalUser,
  ) {
    console.log('NEWEST ENDPOINT HIT', dto);

    return this.salonsService.findNewestSalons(dto, req.user?.sub);
  }

  @Get('recommended')
  @ApiOperation({ summary: 'Get recommended salons based on rating' })
  findRecommendedSalons(
    @Query() dto: PaginationQueryDto,
    @Req() req: RequestWithOptionalUser,
  ) {
    console.log('RECOMMENDED ENDPOINT HIT', dto);

    return this.salonsService.findRecommendedSalons(dto, req.user?.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get salon by ID' })
  @ApiOkResponse({ type: SalonDetailResponseDto })
  getSalonById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithOptionalUser,
  ) {
    return this.salonsService.getSalonById(id, req.user?.sub);
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
