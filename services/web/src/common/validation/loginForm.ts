import { MIN_PASSWORD_LENGTH } from '@lumii/types';
import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email('Email has invalid format'),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
});

export type LoginFormSchemaProps = z.infer<typeof loginFormSchema>;
