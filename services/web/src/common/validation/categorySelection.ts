import { SalonCategory } from '@lumii/types';
import { z } from 'zod';

export const categorySelectionSchema = z.object({
  categories: z.nativeEnum(SalonCategory),
});

export type CategorySelectionFormSchemaProps = z.infer<typeof categorySelectionSchema>;
