import { v2 as cloudinary } from 'cloudinary';

import { configs } from '#/configs';

import type { CloudinaryUploadResult } from './cloudinary.types';

cloudinary.config({
  api_key: configs.cloudinaryApiKey,
  api_secret: configs.cloudinaryApiSecret,
  cloud_name: configs.cloudinaryCloudName,
  secure: true,
});

/* ─────────────────────────────────────────────────────────────────── */
/* Context helpers                                                       */
/* ─────────────────────────────────────────────────────────────────── */

// Strip characters that would break Cloudinary's key=value|key=value format
export function safeCtxValue(s: string | number | undefined): string {
  return String(s ?? '')
    .replace(/[|=\n\r]/g, ' ')
    .trim();
}

/* ─────────────────────────────────────────────────────────────────── */
/* Transformation helpers                                               */
/* ─────────────────────────────────────────────────────────────────── */

function buildResizeStep(): object {
  return {
    crop: 'fit',
    fetch_format: 'webp',
    height: 800,
    quality: 'auto',
    width: 800,
  };
}

/* ─────────────────────────────────────────────────────────────────── */
/* Upload                                                                */
/* ─────────────────────────────────────────────────────────────────── */

/**
 * Upload a raw file buffer to Cloudinary.
 * Stores app metadata (id, title, status, originalSize, moderationSource)
 * as Cloudinary context fields so photos survive server restarts.
 */
export async function uploadChunkToCloudinary(props: {
  fileBuffer: Buffer;
  filename: string;
  metadata: { id: string; originalSize: number; title: string };
  tags: string[];
}): Promise<CloudinaryUploadResult> {
  const { fileBuffer, filename, metadata, tags } = props;

  const uploadPreset = configs.cloudinaryUploadPreset;

  const transformation: object[] = [buildResizeStep()];

  const uploadOptions = {
    // All app metadata stored here — no separate database needed
    context: {
      pw_id: metadata.id,
      pw_original_size: String(metadata.originalSize),
      pw_status: 'pending',
      pw_title: safeCtxValue(metadata.title),
    },
    // folder: 'community-photo-wall',
    public_id: `${Date.now()}-${filename.replace(/\.[^/.]+$/, '')}`,
    resource_type: 'image' as const,
    tags,
    transformation,
    ...(uploadPreset ? { upload_preset: uploadPreset } : {}),
  };

  console.log('[Cloudinary] upload starting', {
    bytes: fileBuffer.length,
    cloudName: process.env['CLOUDINARY_CLOUD_NAME'],
    filename,
    metaId: metadata.id,
    preset: uploadPreset ?? '(none)',
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          console.error('[Cloudinary] upload error:', error);
          reject(
            new Error(
              error
                ? `Cloudinary ${error.http_code ?? 'error'}: ${error.message}`
                : 'Cloudinary returned no result',
            ),
          );

          return;
        }
        console.log('[Cloudinary] upload success:', {
          bytes: result.bytes,
          height: result.height,
          public_id: result.public_id,
          width: result.width,
        });
        resolve({
          bytes: result.bytes,
          height: result.height,
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
        });
      },
    );
    stream.end(fileBuffer);
  });
}
