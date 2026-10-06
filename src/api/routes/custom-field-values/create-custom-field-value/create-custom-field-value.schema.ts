import z from 'zod';

import { userIdSchema } from '#/api/db-tables-schema';

import { customFieldValueSchema } from '../custom-field-values.schema';

export const createCustomFieldValuesSchema = z.object({
  records: z.array(
    z
      .object({
        customFieldId: z.number().min(1).describe('Custom Field ID'),
        value: customFieldValueSchema,
      })
      .strict(),
  ),
});

export const createCustomFieldValuesDbQuerySchema =
  createCustomFieldValuesSchema.extend({
    userId: userIdSchema,
  });
