import { VALIDATION_MESSAGES } from '@lumii/messages';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, passwordRegex, phoneRegex } from '@lumii/types';
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

  phone: z.string().regex(phoneRegex, VALIDATION_MESSAGES.INVALID_PHONE_FORMAT),
});

export type PersonalInformationFormSchemaProps = z.infer<typeof ownerPersonalInformationSchema>;
