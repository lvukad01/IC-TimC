import { DepositType } from '@lumii/types';

export interface DepositInput {
  totalAmount: number;
  depositType: DepositType;
  depositValue: number;
}
