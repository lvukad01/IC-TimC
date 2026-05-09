export const BOOKING_CANCELLATION_POLICY = {
  FULL_REFUND_BEFORE_HOURS: 48,
  PARTIAL_REFUND_BEFORE_HOURS: 24,
} as const;

export const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
