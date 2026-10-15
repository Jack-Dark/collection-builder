import z from 'zod';

export const deleteUnusedCustomFieldValuesSchema = z.strictObject({
  collectionId: z.number().min(1),
});
