import { VALIDATION_MESSAGES } from '@lumii/messages';
import {
  countryCodeRegex,
  MAX_CITY_LENGTH,
  MAX_STREET_LENGTH,
  MIN_CITY_LENGTH,
  MIN_STREET_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  zipcodeRegex,
} from '@lumii/types';
import { z } from 'zod';

console.log(countryCodeRegex);
export const salonLocationSchema = z.object({
  name: z
    .string()
    .min(NAME_MIN_LENGTH, VALIDATION_MESSAGES.minMsg(NAME_MIN_LENGTH))
    .max(NAME_MAX_LENGTH, VALIDATION_MESSAGES.maxMsg(NAME_MAX_LENGTH)),

  street: z
    .string()
    .min(MIN_STREET_LENGTH, VALIDATION_MESSAGES.minMsg(MIN_STREET_LENGTH))
    .max(MAX_STREET_LENGTH, VALIDATION_MESSAGES.maxMsg(MAX_STREET_LENGTH)),

  city: z
    .string()
    .min(MIN_CITY_LENGTH, VALIDATION_MESSAGES.minMsg(MIN_CITY_LENGTH))
    .max(MAX_STREET_LENGTH, VALIDATION_MESSAGES.maxMsg(MAX_CITY_LENGTH)),
  zipcode: z.string().regex(zipcodeRegex, VALIDATION_MESSAGES.INVALID_ZIPCODE_FORMAT),
  country: z.string().regex(countryCodeRegex, VALIDATION_MESSAGES.INVALID_COUNTRY_NAME),
});

export type SalonLocationFormSchemaProps = z.infer<typeof salonLocationSchema>;
