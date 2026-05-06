import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('salons')
@ApiBearerAuth()
@Controller('salons')
export class SalonsController {
  @Get()
  @ApiOperation({ summary: 'Get all salons' })
  getAllSalons(
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('category') category?: string,
  ) {}
}
