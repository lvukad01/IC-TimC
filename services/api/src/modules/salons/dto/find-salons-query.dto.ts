import { dateRegex, FindSalonsQuery, SalonCategory } from '@lumii/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class FindSalonsQueryDto implements FindSalonsQuery {
  @ApiPropertyOptional({
    description: 'Search salons by name',
    example: 'Hair Studio',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by city name',
    example: 'Zagreb',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Filter by salon category',
    example: 'HAIR',
    enum: SalonCategory,
  })
  @IsOptional()
  @IsEnum(SalonCategory)
  category?: SalonCategory;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by availability date',
    example: '2026-05-10',
  })
  @IsOptional()
  @Matches(dateRegex, {
    message: 'Invalid date format, use YYYY-MM-DD',
  })
  date?: string;

  @ApiPropertyOptional({
    description: 'Filter by service availability',
  })
  @IsOptional()
  @IsUUID()
  serviceId?: string;
}
