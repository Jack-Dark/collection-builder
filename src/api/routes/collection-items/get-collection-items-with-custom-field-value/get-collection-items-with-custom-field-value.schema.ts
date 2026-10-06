import z from 'zod';

import { userIdSchema } from '#/api/db-tables-schema';

export const getCollectionItemsWithCustomFieldValueSchema = z.object({
  id: z.number().min(1).describe('Custom Field ID'),
});

export const getCollectionItemsWithCustomFieldValueDbQuerySchema =
  getCollectionItemsWithCustomFieldValueSchema.extend({
    userId: userIdSchema,
  });
