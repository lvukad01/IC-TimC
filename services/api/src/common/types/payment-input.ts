import { PaymentMethod } from '@lumii/types';

export interface PaymentInput {
  bookingId: string;
  clientId: string;
  totalAmount: number;
  depositAmount: number;
  method: PaymentMethod;
}

export interface PaymentRefundInput {
  bookingId: string;
  clientId: string;
  refunds: {
    amount: number;
    method: PaymentMethod;
  }[];
}
