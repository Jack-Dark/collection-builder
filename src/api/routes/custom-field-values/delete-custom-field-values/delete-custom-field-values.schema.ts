import z from 'zod';

export const deleteCustomFieldValuesSchema = z.object({
  collectionItemId: z
    .union([z.number().min(1), z.string().min(1)])
    .describe('CollectionItem ID'),
  ids: z
    .array(z.number().min(1).describe('Custom Field Value ID'))
    .min(1)
    .describe('Custom Field Value IDs'),
});
