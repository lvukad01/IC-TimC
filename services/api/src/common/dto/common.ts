import { ActionResponse, PaginationQuery } from '@lumii/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ActionResponseDto implements ActionResponse {
  @ApiPropertyOptional({ description: 'Entity id' })
  id?: string;

  @ApiProperty({ description: 'Description of the performed action' })
  message: string;
}

export class PaginationQueryDto implements PaginationQuery {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}
