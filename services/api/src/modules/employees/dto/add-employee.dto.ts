import { ApiProperty } from '@nestjs/swagger';
import {
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  EmployeeRole,
  CreateEmployeeRequest,
} from '@lumii/types';
import { IsBoolean, IsEnum, IsString, Length } from 'class-validator';

export class AddEmployeeDto implements CreateEmployeeRequest {
  @ApiProperty({ example: 'John', required: true })
  @IsString()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({ enum: EmployeeRole, required: true })
  @IsEnum(EmployeeRole, { each: true })
  role: EmployeeRole;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  isActive: boolean;
}
