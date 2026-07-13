import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import type { Photo } from '#/lib/cloudinary.types';

import { CHUNK_SIZE } from '#/hooks/use-upload-file';
import { uploadChunkToCloudinary } from '#/lib/cloudinary';
import { arrayBufferToBase64 } from '#/lib/utils';

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
  .handler(async ({ data }): Promise<Photo | null> => {
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

    console.log(
      `[Chunk] received chunk ${chunkIndex + 1}/${totalChunks} for upload "${uploadId}"`,
    );

    if (!chunkBuffers.has(uploadId)) {
      chunkBuffers.set(uploadId, new Array(totalChunks).fill(null));
    }

    const chunks = chunkBuffers.get(uploadId)!;
    chunks[chunkIndex] = Buffer.from(chunkBase64, 'base64');

    const received = chunks.filter((c) => {
      return c !== null;
    }).length;
    console.log(
      `[Chunk] upload "${uploadId}": ${received}/${totalChunks} chunks received`,
    );

    if (received < totalChunks) return null;

    console.log(`[Chunk] all chunks received for "${uploadId}", assembling…`);
    chunkBuffers.delete(uploadId);
    const fileBuffer = Buffer.concat(chunks as Buffer[]);
    console.log(`[Chunk] assembled buffer: ${fileBuffer.length} bytes`);

    // Generate a stable ID that gets stored in Cloudinary context
    const photoId = `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const photoTitle = title.trim() || filename;

    const result = await uploadChunkToCloudinary({
      fileBuffer,
      filename,
      metadata: {
        id: photoId,
        originalSize,
        title: photoTitle,
      },
      tags,
    });

    // Build Photo from upload result + metadata we just stored in Cloudinary context
    const photo: Photo = {
      createdAt: new Date().toISOString(),
      height: result.height,
      id: photoId,
      originalSize,
      processedSize: result.bytes,
      publicId: result.public_id,
      status: 'pending',
      title: photoTitle,
      url: result.secure_url,
      width: result.width,
    };

    return photo;
  });

export const chunkAndUploadFileToCloudinary = async (
  file: File,
  tags: string[],
  callback: typeof uploadChunkActionServerFn,
) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const totalChunks = Math.max(1, Math.ceil(bytes.length / CHUNK_SIZE));
    const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    let photo: Photo | null = null;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const chunk = bytes.slice(start, start + CHUNK_SIZE);
      // Uint8Array.slice() returns a copy with its own buffer — safe to pass directly
      const chunkBase64 = arrayBufferToBase64(chunk.buffer);
      const filename = file.name;
      const originalSize = file.size;

      const result = await callback({
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
