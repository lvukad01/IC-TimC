import { VALIDATION_MESSAGES } from '@lumii/messages';
import {
  MAX_STREET_LENGTH,
  MIN_STREET_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  passwordRegex,
  phoneRegex,
} from '@lumii/types';
import { z } from 'zod';

export const ownerPersonalInformationSchema = z.object({
  email: z.email(VALIDATION_MESSAGES.EMAIL_INVALID),

  password: z.string().regex(passwordRegex, VALIDATION_MESSAGES.PASSWORD_WEAK),

  firstName: z
    .string()
    .min(NAME_MIN_LENGTH, VALIDATION_MESSAGES.minMsg(NAME_MIN_LENGTH))
    .max(NAME_MAX_LENGTH, VALIDATION_MESSAGES.maxMsg(NAME_MAX_LENGTH)),

  lastName: z
    .string()
    .min(NAME_MIN_LENGTH, VALIDATION_MESSAGES.minMsg(NAME_MIN_LENGTH))
    .max(NAME_MAX_LENGTH, VALIDATION_MESSAGES.maxMsg(NAME_MAX_LENGTH)),

  phone: z.string().regex(phoneRegex, VALIDATION_MESSAGES.INVALID_PHONE_FORMAT).optional(),

  street: z
    .string()
    .min(MIN_STREET_LENGTH, VALIDATION_MESSAGES.minMsg(MIN_STREET_LENGTH))
    .max(MAX_STREET_LENGTH, VALIDATION_MESSAGES.maxMsg(MAX_STREET_LENGTH)),
});

export type PersonalInformationFormSchemaProps = z.infer<typeof ownerPersonalInformationSchema>;
