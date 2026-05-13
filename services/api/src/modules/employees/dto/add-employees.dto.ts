import { CreateEmployeesRequest } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { AddEmployeeDto } from './add-employee.dto';

export class AddEmployeesDto implements CreateEmployeesRequest {
  @ApiProperty({ type: AddEmployeesDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  employees: AddEmployeeDto[];
}
