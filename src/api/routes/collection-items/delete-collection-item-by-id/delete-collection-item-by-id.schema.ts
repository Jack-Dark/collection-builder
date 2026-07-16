import z from 'zod';

export const deleteCollectionItemByIdSchema = z.object({
  collectionItemIds: z.array(z.number()),
});
