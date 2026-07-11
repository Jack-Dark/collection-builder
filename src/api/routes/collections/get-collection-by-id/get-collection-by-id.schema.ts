import z from 'zod';

export const getCollectionByIdSchema = z.object({
  collectionId: z.number(),
});
