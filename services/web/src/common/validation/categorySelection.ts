import { SalonCategory } from '@lumii/types';
import { z } from 'zod';

export const categorySelectionSchema = z.object({
  categories: z.array(z.enum(SalonCategory)).min(1, 'Please select at least one category'),
});

export type CategorySelectionFormSchemaProps = z.infer<typeof categorySelectionSchema>;
