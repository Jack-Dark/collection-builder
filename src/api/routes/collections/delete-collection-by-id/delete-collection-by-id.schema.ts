import z from 'zod';

export const deleteCollectionsByIdsSchema = z.object({
  ids: z
    .array(z.number().describe('Collection ID'))
    .min(1)
    .describe('Collection IDs'),
});
