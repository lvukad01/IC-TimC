import {
  FindSalonsQuery,
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MIN_LATITUDE,
  MIN_LONGITUDE,
  SalonCategory,
} from '@lumii/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
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
    description: 'Search radius in meters (geo filter)',
    example: 10000,
  })
  @IsOptional()
  @IsNumber()
  radiusMeters?: number;

  @ApiPropertyOptional({
    description: 'Latitude for geo search center',
    example: 45.815,
  })
  @IsOptional()
  @IsNumber()
  @Min(MAX_LATITUDE)
  @Max(MIN_LATITUDE)
  lat?: number;

  @ApiPropertyOptional({
    description: 'Longitude for geo search center',
    example: 15.981,
  })
  @IsOptional()
  @IsNumber()
  @Min(MIN_LONGITUDE)
  @Max(MAX_LONGITUDE)
  lng?: number;

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
}
