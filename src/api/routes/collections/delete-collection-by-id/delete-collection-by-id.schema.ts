import z from 'zod';

export const deleteCollectionsByIdsSchema = z.object({
  ids: z.array(z.number()),
});
