import z from 'zod';

import { userIdSchema } from '#/api/db-tables-schema';

export const deleteCustomFieldValuesSchema = z.object({
  collectionItemId: z.number().min(1).describe('CollectionItem ID'),
  ids: z
    .array(z.number().min(1).describe('Custom Field Value ID'))
    .describe('Custom Field Value IDs'),
});

export const deleteCustomFieldValuesDbQuerySchema =
  deleteCustomFieldValuesSchema.extend({
    userId: userIdSchema,
  });
