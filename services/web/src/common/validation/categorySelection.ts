import { SalonCategory } from '@lumii/types';
import { z } from 'zod';

export const categorySelectionSchema = z.object({
  categories: z.enum(SalonCategory, { error: 'Please select one category' }),
});

export type CategorySelectionFormSchemaProps = z.infer<typeof categorySelectionSchema>;
