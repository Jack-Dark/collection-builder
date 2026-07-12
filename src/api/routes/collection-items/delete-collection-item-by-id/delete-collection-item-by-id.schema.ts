import z from 'zod';

export const deleteCollectionItemByIdSchema = z.object({
  collectionItemId: z.number(),
});
