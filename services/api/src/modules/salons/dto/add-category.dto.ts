import { SalonCategory } from '@lumii/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class AddCategoryDto {
  @ApiProperty({ example: 'Haircut', required: true })
  @IsEnum(SalonCategory)
  category: SalonCategory;
}
