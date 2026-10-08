import z from 'zod';

export const getCollectionItemsWithCustomFieldValueSchema = z.object({
  customFieldValueId: z.number().min(1).describe('Custom Field Value ID'),
});
