import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import {
  Controller,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { UserRole } from 'generated/prisma/edge';
import { RolesAuth } from '@decorators/auth.decorator';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@ApiTags('salons/:salonId/employees')
@ApiBearerAuth()
@Controller('salons/:salonId/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  getAllEmployees(@Param('salonId') salonId: string) {
    return this.employeesService.getAllEmployees(salonId);
  }

  @Get(':id')
  getEmployeeById(
    @Param('salonId') salonId: string,
    @Param('id') employeeId: string,
  ) {
    return this.employeesService.getEmployeeById(salonId, employeeId);
  }

  @Post()
  @RolesAuth(UserRole.SALON_OWNER)
  addEmployee(
    @Param('salonId') salonId: string,
    @Body() addEmployeeDto: AddEmployeeDto,
  ) {
    return this.employeesService.addEmployee(salonId, addEmployeeDto);
  }

  @Patch(':id')
  @RolesAuth(UserRole.SALON_OWNER)
  updateEmployee(
    @Param('salonId') salonId: string,
    @Param('id') employeeId: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.updateEmployee(
      salonId,
      employeeId,
      updateEmployeeDto,
    );
  }

  @Delete(':id')
  @RolesAuth(UserRole.SALON_OWNER)
  deleteEmployee(
    @Param('salonId') salonId: string,
    @Param('id') employeeId: string,
  ) {
    return this.employeesService.deleteEmployee(salonId, employeeId);
  }
}
