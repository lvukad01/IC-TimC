import { DepositType } from '@lumii/types';
import { DepositInput } from '@tstypes/deposit-input';

export function calculateDepositAmount({
  totalAmount,
  depositType,
  depositValue,
}: DepositInput) {
  if (depositType === DepositType.PERCENTAGE)
    return (totalAmount * depositValue) / 100;
  else return depositValue;
}
