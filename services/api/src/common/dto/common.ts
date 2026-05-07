import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActionResponseDto implements ActionResponseDto {
  @ApiPropertyOptional({ description: 'Entity id' })
  id?: string;

  @ApiProperty({ description: 'Description of the performed action' })
  message: string;
}
