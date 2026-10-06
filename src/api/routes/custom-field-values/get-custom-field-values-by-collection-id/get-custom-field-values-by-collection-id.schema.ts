import z from 'zod';

import { userIdSchema } from '#/api/db-tables-schema';

export const getCustomFieldValuesByCustomFieldIdSchema = z.object({
  id: z.number().min(1).describe('Custom Field ID'),
});

export const getCustomFieldValuesByCustomFieldIdDbQuerySchema =
  getCustomFieldValuesByCustomFieldIdSchema.extend({
    userId: userIdSchema,
  });
