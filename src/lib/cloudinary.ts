import type { UploadApiOptions, UploadApiResponse } from 'cloudinary';

import { v2 as cloudinary } from 'cloudinary';

import { configs } from '#/configs';

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
/* Upload                                                                */
/* ─────────────────────────────────────────────────────────────────── */

export const uploadChunkToCloudinary = async (props: {
  fileBuffer: Buffer;
  filename: string;
  tags: string[];
}): Promise<UploadApiResponse> => {
  const { fileBuffer, filename, tags } = props;

  const uploadOptions: UploadApiOptions = {
    public_id: `${Date.now()}-${filename.replace(/\.[^/.]+$/, '')}`,
    resource_type: 'image' as const,
    tags,
    transformation: [
      {
        crop: 'limit',
        fetch_format: 'webp',
        height: 800,
        quality: 'auto',
        width: 800,
      },
    ],
    upload_preset: configs.cloudinaryUploadPreset,
  };

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

        resolve(result);
      },
    );
    stream.end(fileBuffer);
  });
};

export const deleteCloudinaryAssetsByTag = (tag: string) => {
  return cloudinary.api.delete_resources_by_tag(tag);
};

export const deleteCloudinaryAssetsByPublicIds = (...publicIds: string[]) => {
  return cloudinary.api.delete_resources(publicIds);
};
