import z from 'zod';

export const deleteCollectionItemsByIdsSchema = z.object({
  collectionItemIds: z.array(z.number()),
});
