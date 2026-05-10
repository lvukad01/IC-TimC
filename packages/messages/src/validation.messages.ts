export const VALIDATION_MESSAGES = {
  PASSWORD_WEAK: 'Password must contain at least one letter, one number and one special character',
  NAME_INVALID: 'Name can contain only letters, spaces, apostrophes, or hyphens',
  INVALID_PHONE_FORMAT: 'Phone number must be in valid international format (+123...)',
  INVALID_ZIPCODE_FORMAT: 'ZIP code must be numeric only and have between 4 and 10 characters',
  INVALID_SERVICE_NAME:
    'Name must be 2-50 characters long and can contain letters, numbers, spaces, hyphens, and apostrophes.',
  PAYMENT_CONFIG_CONFLICT: 'Payment config already exists.',
  INVALID_START_TIME_END_TIME: 'Start time must be before end time',
  EMPLOYEE_NOT_AVAILABLE: 'Employee is not available on the selected day',
  INVALID_WORKING_HOURS: 'Booking is outside of working hours',
  EMPLOYEE_ALREADY_BOOKED: 'Employee is already booked in this time slot',
};
