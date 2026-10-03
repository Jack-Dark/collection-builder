import z from 'zod';

export const getCollectionsWithCustomFieldsSchema = z.object({
  customFieldIds: z
    .array(z.number().min(1).describe('Custom Field ID'))
    .describe('Custom Field IDs'),
});

export const getCollectionsWithCustomFieldsDbQuerySchema =
  getCollectionsWithCustomFieldsSchema.extend({
    userId: z.string().min(1).describe('User ID'),
  });
