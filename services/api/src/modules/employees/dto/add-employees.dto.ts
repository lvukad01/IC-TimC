import { CreateEmployeesRequest } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { AddEmployeeDto } from './add-employee.dto';

export class AddEmployeesDto implements CreateEmployeesRequest {
  @ApiProperty({ type: AddEmployeeDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AddEmployeeDto)
  employees: AddEmployeeDto[];
}
