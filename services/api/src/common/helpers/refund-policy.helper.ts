import {
  BOOKING_CANCELLATION_POLICY,
  PaymentMethod,
  PaymentType,
} from '@lumii/types';

type RefundOutput = {
  amount: number;
  method: PaymentMethod;
  type: PaymentType;
};

export function calculateRefundPolicy(
  startTime: Date,
  depositAmount: number,
): number {
  const now = new Date();
  const diffHours = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours < BOOKING_CANCELLATION_POLICY.PARTIAL_REFUND_BEFORE_HOURS)
    return 0;

  if (diffHours < BOOKING_CANCELLATION_POLICY.FULL_REFUND_BEFORE_HOURS)
    return depositAmount * 0.5;

  return depositAmount;
}
