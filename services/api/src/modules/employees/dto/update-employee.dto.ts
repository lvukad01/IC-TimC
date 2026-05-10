import {
  EmployeeRole,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  nameRegex,
  UpdateEmployeeRequest,
} from '@lumii/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, Length, Matches } from 'class-validator';

export class UpdateEmployeeDto implements UpdateEmployeeRequest {
  @ApiPropertyOptional()
  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @Matches(nameRegex)
  name?: string;

  @ApiPropertyOptional({ enum: EmployeeRole })
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;

  @ApiPropertyOptional()
  isActive?: boolean;
}
