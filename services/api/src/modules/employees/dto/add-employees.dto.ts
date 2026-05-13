import { CreateEmployeesRequest } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { AddEmployeeDto } from './add-employee.dto';

export class AddEmployeesDto implements CreateEmployeesRequest {
  @ApiProperty({ type: AddEmployeeDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  employees: AddEmployeeDto[];
}
