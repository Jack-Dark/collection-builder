import z from 'zod';

import { baseCustomFieldSchema } from '../custom-fields.schema';

export const createCustomFieldsSchema = z.object({
  records: z.array(
    baseCustomFieldSchema.extend({ collectionId: z.number().optional() }),
  ),
});
