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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { AddEmployeesDto } from './dto/add-employees.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

@ApiTags('salons/:salonId/employees')
@ApiBearerAuth()
@RolesAuth(UserRole.SALON_OWNER, UserRole.ADMIN)
@Controller('salons/:salonId/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all employees for a salon' })
  @ApiOkResponse({ type: EmployeeResponseDto, isArray: true })
  getAllEmployees(@Param('salonId', ParseUUIDPipe) salonId: string) {
    return this.employeesService.getAllEmployees(salonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  getEmployeeById(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Param('id', ParseUUIDPipe) employeeId: string,
  ) {
    return this.employeesService.getEmployeeById(salonId, employeeId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new employee to a salon' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @RolesAuth(UserRole.SALON_OWNER)
  addEmployee(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Body() addEmployeeDto: AddEmployeeDto,
  ) {
    return this.employeesService.addEmployee(salonId, addEmployeeDto);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Add new employees to a salon' })
  @ApiOkResponse({ type: ActionResponseDto })
  @RolesAuth(UserRole.SALON_OWNER)
  addEmployees(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Body() addEmployeesDto: AddEmployeesDto,
  ) {
    return this.employeesService.addEmployees(salonId, addEmployeesDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing employee' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @RolesAuth(UserRole.SALON_OWNER)
  updateEmployee(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Param('id', ParseUUIDPipe) employeeId: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.updateEmployee(
      salonId,
      employeeId,
      updateEmployeeDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiOkResponse({
    description: 'Employee deleted successfully',
    type: ActionResponseDto,
  })
  @RolesAuth(UserRole.SALON_OWNER)
  deleteEmployee(
    @Param('salonId', ParseUUIDPipe) salonId: string,
    @Param('id', ParseUUIDPipe) employeeId: string,
  ) {
    return this.employeesService.deleteEmployee(salonId, employeeId);
  }
}
