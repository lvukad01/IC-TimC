import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { ServiceResponseDto } from './dto/service-response.dto';
import { AddServiceDto } from './dto/add-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UserRole } from '@lumii/types';
import { RolesAuth } from '@decorators/auth.decorator';

@ApiTags('services')
@ApiBearerAuth()
@Controller('salons/:salonId/categories/:categoryId/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services for a category' })
  @ApiOkResponse({ type: ServiceResponseDto, isArray: true })
  getAllServices(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    return this.servicesService.getAllServices(salonId, categoryId);
  }

  @Get(':serviceId')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiOkResponse({ type: ServiceResponseDto })
  getServiceById(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ) {
    return this.servicesService.getServiceById(salonId, categoryId, serviceId);
  }

  @Post()
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Add a new service to a category' })
  @ApiCreatedResponse({ type: ServiceResponseDto })
  addService(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Body() addServiceDto: AddServiceDto,
  ) {
    return this.servicesService.addService(salonId, categoryId, addServiceDto);
  }

  @Patch(':serviceId')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Update a service' })
  @ApiOkResponse({ type: ServiceResponseDto })
  updateService(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.updateService(
      salonId,
      categoryId,
      serviceId,
      updateServiceDto,
    );
  }

  @Delete(':serviceId')
  @RolesAuth(UserRole.SALON_OWNER)
  @ApiOperation({ summary: 'Delete a service' })
  @ApiNoContentResponse({ description: 'Service deleted successfully' })
  deleteService(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ) {
    return this.servicesService.deleteService(salonId, categoryId, serviceId);
  }
}
