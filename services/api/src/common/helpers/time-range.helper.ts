import { VALIDATION_MESSAGES } from '@lumii/messages';
import { BadRequestException } from '@nestjs/common';

export function validateTimeRange(start: Date, end: Date) {
  if (start >= end) {
    throw new BadRequestException(
      VALIDATION_MESSAGES.INVALID_START_TIME_END_TIME,
    );
  }
}
