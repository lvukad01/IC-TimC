import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Delete,
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

@ApiTags('salon/:salonid/category/:categoryid')
@ApiBearerAuth()
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services for a category' })
  @ApiOkResponse({ type: ServiceResponseDto, isArray: true })
  getAllServices(
    @Body('salonid', ParseUUIDPipe) salonId: string,
    @Body('categoryid', ParseUUIDPipe) categoryId: string,
  ) {
    return this.servicesService.getAllServices(salonId, categoryId);
  }

  @Get(':serviceId')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiOkResponse({ type: ServiceResponseDto })
  getServiceById(
    @Body('salonid', ParseUUIDPipe) salonId: string,
    @Body('categoryid', ParseUUIDPipe) categoryId: string,
    @Body('serviceId', ParseUUIDPipe) serviceId: string,
  ) {
    return this.servicesService.getServiceById(salonId, categoryId, serviceId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new service to a category' })
  @ApiCreatedResponse({ type: ServiceResponseDto })
  @RolesAuth(UserRole.SALON_OWNER)
  addService(
    @Body('salonid', ParseUUIDPipe) salonId: string,
    @Body('categoryid', ParseUUIDPipe) categoryId: string,
    addServiceDto: AddServiceDto,
  ) {
    return this.servicesService.addService(salonId, categoryId, addServiceDto);
  }

  @Patch(':serviceid')
  @ApiOperation({ summary: 'Update a service' })
  @ApiOkResponse({ type: ServiceResponseDto })
  @RolesAuth(UserRole.SALON_OWNER)
  updateService(
    @Body('salonid', ParseUUIDPipe) salonId: string,
    @Body('categoryid', ParseUUIDPipe) categoryId: string,
    @Body('serviceid', ParseUUIDPipe) serviceId: string,
    updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.updateService(
      salonId,
      categoryId,
      serviceId,
      updateServiceDto,
    );
  }

  @Delete(':serviceid')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiNoContentResponse({ description: 'Service deleted successfully' })
  @RolesAuth(UserRole.SALON_OWNER)
  deleteService(
    @Body('salonid', ParseUUIDPipe) salonId: string,
    @Body('categoryid', ParseUUIDPipe) categoryId: string,
    @Body('serviceid', ParseUUIDPipe) serviceId: string,
  ) {
    return this.servicesService.deleteService(salonId, categoryId, serviceId);
  }
}
