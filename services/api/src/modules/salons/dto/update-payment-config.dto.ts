import { DepositType, UpdatePaymentConfigRequest } from '@lumii/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdatePaymentConfigDto implements UpdatePaymentConfigRequest {
  @ApiPropertyOptional({
    enum: DepositType,
    example: DepositType.PERCENTAGE,
    description:
      'Type of deposit calculation: FIXED amount or PERCENTAGE of booking total',
  })
  @IsEnum(DepositType)
  depositType: DepositType;

  @ApiPropertyOptional({
    example: 30,
    description:
      'Deposit value. If PERCENTAGE → value is 1–100. If FIXED → value is amount in currency (e.g. EUR)',
  })
  depositValue: number;
}
