import z from 'zod';

export const getCollectionsWithCustomFieldsSchema = z.object({
  customFieldIds: z
    .array(z.number().min(1).describe('Custom Field ID'))
    .min(1)
    .describe('Custom Field IDs'),
});
