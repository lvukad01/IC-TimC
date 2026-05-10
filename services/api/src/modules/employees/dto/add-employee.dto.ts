import {
  CreateEmployeeRequest,
  EmployeeRole,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  nameRegex,
} from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, Length, Matches } from 'class-validator';

export class AddEmployeeDto implements CreateEmployeeRequest {
  @ApiProperty({ example: 'John', required: true })
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @Matches(nameRegex)
  name: string;

  @ApiProperty({ enum: EmployeeRole, required: true })
  @IsEnum(EmployeeRole)
  role: EmployeeRole;

  @ApiProperty({ example: true, required: true })
  @IsBoolean()
  isActive: boolean;
}
