import z from 'zod';

export const uploadCloudinaryFileSchema = z.object({
  chunkBase64: z.string(),
  chunkIndex: z.number(),
  filename: z.string(),
  tags: z.array(z.string()).optional(),
  totalChunks: z.number(),
  uploadId: z.string(),
});
