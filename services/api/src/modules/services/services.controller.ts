import { Body, Controller, Get, ParseUUIDPipe, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { ServiceResponseDto } from './dto/service-response.dto';
import { AddServiceDto } from './dto/add-service.dto';

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
  addService(
    @Body('salonid', ParseUUIDPipe) salonId: string,
    @Body('categoryid', ParseUUIDPipe) categoryId: string,
    addServiceDto: AddServiceDto,
  ) {
    return this.servicesService.addService(salonId, categoryId, addServiceDto);
  }
}
