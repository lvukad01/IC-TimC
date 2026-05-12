import { CheckMailRequest } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CheckMailQuery implements CheckMailRequest {
  @ApiProperty()
  @IsEmail()
  email: string;
}
