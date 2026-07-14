import z from 'zod';

export const deleteCloudinaryAssetsByTagSchema = z.object({
  tag: z.string(),
});
