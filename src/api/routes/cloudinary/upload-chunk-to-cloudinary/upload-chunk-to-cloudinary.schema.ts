import z from 'zod';

export const uploadCloudinaryFileSchema = z.object({
  chunkBase64: z.string(),
  chunkIndex: z.number(),
  filename: z.string(),
  originalSize: z.number(),
  tags: z.array(z.string()),
  title: z.string(),
  totalChunks: z.number(),
  uploadId: z.string(),
});
