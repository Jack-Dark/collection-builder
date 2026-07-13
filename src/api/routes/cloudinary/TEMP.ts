import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import type { CloudinaryUploadResult } from '#/lib/cloudinary.types';

import { uploadChunkToCloudinary } from '#/lib/cloudinary';
import { arrayBufferToBase64 } from '#/lib/utils';

/* Chunk size: 1 MB. Small enough to avoid memory spikes; large enough to be fast. */
export const CHUNK_SIZE = 1 * 1024 * 1024;

export const createCollectionItemCloudinaryTags = (props: {
  collectionId: number;
  collectionItemId: number;
  userId: string;
}) => {
  const { collectionId, collectionItemId, userId } = props;

  return [
    `collection-item-${collectionItemId}`,
    `user-${userId}`,
    `collection-${collectionId}`,
  ];
};

// ? Module-level map survives for the lifetime of the server process.
const chunkBuffers = new Map<string, (Buffer | null)[]>();

const uploadCloudinaryFileSchema = z.object({
  chunkBase64: z.string(),
  chunkIndex: z.number(),
  filename: z.string(),
  originalSize: z.number(),
  tags: z.array(z.string()),
  title: z.string(),
  totalChunks: z.number(),
  uploadId: z.string(),
});

/**
 * Receives one chunk at a time. On the final chunk, assembles the buffer,
 * uploads to Cloudinary (including all app metadata as context fields),
 * and returns the created Photo. Returns null for intermediate chunks.
 */
export const uploadChunkActionServerFn = createServerFn({ method: 'POST' })
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

export const chunkAndUploadFileToCloudinary = async (props: {
  file: File;
  tags: string[];
}) => {
  try {
    const { file, tags } = props;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const totalChunks = Math.max(1, Math.ceil(bytes.length / CHUNK_SIZE));
    const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    let photo: CloudinaryUploadResult | null = null;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const chunk = bytes.slice(start, start + CHUNK_SIZE);
      // Uint8Array.slice() returns a copy with its own buffer — safe to pass directly
      const chunkBase64 = arrayBufferToBase64(chunk.buffer);
      const filename = file.name;
      const originalSize = file.size;

      const result = await uploadChunkActionServerFn({
        data: {
          chunkBase64,
          chunkIndex: i,
          filename,
          originalSize,
          tags,
          title: filename,
          totalChunks,
          uploadId,
        },
      });

      if (result !== null) {
        photo = result;
      }
    }

    if (photo) {
      return photo;
    } else {
      throw new Error('Upload completed but no photo was returned.');
    }
  } catch (err) {
    console.error('[Upload] failed:', err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'Upload failed — check the server terminal for details.';

    throw new Error(message);
  }
};
