import { VALIDATION_MESSAGES } from '@lumii/messages';
import { EmployeeRole, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '@lumii/types';
import { z } from 'zod';

export const employeeAdditionSchema = z.object({
  name: z
    .string()
    .min(NAME_MIN_LENGTH, VALIDATION_MESSAGES.minMsg(NAME_MIN_LENGTH))
    .max(NAME_MAX_LENGTH, VALIDATION_MESSAGES.maxMsg(NAME_MAX_LENGTH)),

  role: z.enum(EmployeeRole),

  isActive: z.boolean(),
});

export const employeesAdditionSchema = z.object({
  employees: z.array(employeeAdditionSchema),
});

export type EmployeesAdditionFormSchemaProps = z.infer<typeof employeesAdditionSchema>;
export type EmployeeAdditionFormSchemaProps = z.infer<typeof employeeAdditionSchema>;
