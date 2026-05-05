import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Lana', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Ivić', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '091 234 567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 45.815, required: false })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({ example: 15.9819, required: false })
  @IsOptional()
  @IsNumber()
  lng?: number;
}
