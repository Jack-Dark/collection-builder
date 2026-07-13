import type { Photo } from '#/lib/cloudinary.types';

import {
  chunkAndUploadFileToCloudinary,
  uploadChunkActionServerFn,
} from '#/api/routes/cloudinary/TEMP';
import { useSpinner } from '#/components/FullPageLoadingSpinner/useSpinner';
import { useNotifications } from '#/components/Notifications';

/* Chunk size: 1 MB. Small enough to avoid memory spikes; large enough to be fast. */
export const CHUNK_SIZE = 1 * 1024 * 1024;

export const useUploadFile = () => {
  const { onInterceptProcessingRequest, processing } = useSpinner();
  const { notifyError } = useNotifications();

  const createPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  const handleUploadFile = async (props: {
    file: File;
    tags: string[];
  }): Promise<Photo> => {
    return onInterceptProcessingRequest(async () => {
      try {
        const { file, tags } = props;

        return await chunkAndUploadFileToCloudinary(
          file,
          tags,
          uploadChunkActionServerFn,
        );
      } catch (err) {
        console.error('[Upload] failed:', err);
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : 'Upload failed — check the server terminal for details.';
        notifyError(message);
      }
    });
  };

  return {
    createPreviewUrl,
    handleUploadFile,
    processing,
  };
};
