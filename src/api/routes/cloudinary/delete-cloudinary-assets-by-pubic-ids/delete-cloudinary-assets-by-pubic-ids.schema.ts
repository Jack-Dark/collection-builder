import z from 'zod';

export const deleteCloudinaryAssetsByPublicIdsSchema = z.object({
  publicIds: z.array(z.string()),
});
