import type { UploadApiOptions, UploadApiResponse } from 'cloudinary';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
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
  tags?: string[];
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
    upload_preset: import.meta.env.CLOUDINARY_UPLOAD_PRESET,
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
  if (tag) {
    return cloudinary.api.delete_resources_by_tag(tag);
  }
};

export const deleteCloudinaryAssetsByPublicIds = (...publicIds: string[]) => {
  if (publicIds.length) {
    return cloudinary.api.delete_resources(publicIds);
  }
};

export const addCloudinaryTagsToPublicIds = (props: {
  publicIds: string[];
  tags: string[];
}) => {
  const { publicIds, tags } = props;

  if (tags.length && publicIds.length) {
    return cloudinary.uploader.add_tag(tags.join(', '), publicIds);
  }
};
