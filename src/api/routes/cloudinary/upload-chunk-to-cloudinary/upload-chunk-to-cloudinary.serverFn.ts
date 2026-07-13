import { createServerFn } from '@tanstack/react-start';

import { uploadChunkToCloudinary } from '#/lib/cloudinary';

import { uploadCloudinaryFileSchema } from './upload-chunk-to-cloudinary.schema';

// ? Module-level map survives for the lifetime of the server process.
const chunkBuffers = new Map<string, (Buffer | null)[]>();

/**
 * Receives one chunk at a time. On the final chunk, assembles the buffer,
 * uploads to Cloudinary (including all app metadata as context fields),
 * and returns the created Photo. Returns null for intermediate chunks.
 */
export const uploadChunkToCloudinaryServerFn = createServerFn({
  method: 'POST',
})
  .validator(uploadCloudinaryFileSchema)
  .handler(async ({ data }) => {
    const {
      chunkBase64,
      chunkIndex,
      filename,
      originalSize,
      tags,
      title,
      totalChunks,
      uploadId,
    } = data;

    if (!chunkBuffers.has(uploadId)) {
      chunkBuffers.set(uploadId, new Array(totalChunks).fill(null));
    }

    const chunks = chunkBuffers.get(uploadId)!;
    chunks[chunkIndex] = Buffer.from(chunkBase64, 'base64');

    const received = chunks.filter((c) => {
      return c !== null;
    }).length;

    if (received < totalChunks) return null;

    chunkBuffers.delete(uploadId);
    const fileBuffer = Buffer.concat(chunks as Buffer[]);

    // Generate a stable ID that gets stored in Cloudinary context
    const photoId = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const result = await uploadChunkToCloudinary({
      fileBuffer,
      filename,
      metadata: {
        id: photoId,
        originalSize,
        title,
      },
      tags,
    });

    return result;
  });
