import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef } from 'react';

import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import {
  createCloudinaryUrl,
  thumbnailSize,
} from '#/api/routes/cloudinary/cloudinary-url';
import { Image } from '#/components/Image';
import { SimpleErrorBoundary } from '#/components/SimpleErrorBoundary';

export const CollectionDetailsImagesField = ({
  form,
  rowIndex,
}: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowIndex: number;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form.ArrayField name={`collectionItems[${rowIndex}].images`}>
      {(field) => {
        return (
          <>
            {field.value.map((image, index) => {
              let publicId = '';
              let previewUrl = '';

              if (typeof image === 'string') {
                publicId = image;
              } else {
                previewUrl = image.previewUrl;
              }

              const src =
                previewUrl ||
                createCloudinaryUrl({
                  height: thumbnailSize,
                  publicId,
                  width: thumbnailSize,
                });

              return (
                <SimpleErrorBoundary key={src}>
                  <div className="relative p-1 size-14 border border-theme-divider-3 bg-theme-surface-2 text-theme-t2">
                    <div
                      className="absolute right-0 top-0 flex justify-end p-4px bg-inherit border-l border-b border-theme-divider-3 rounded-bl-sm text-lg hover:text-theme-t-alert cursor-pointer"
                      onClick={() => {
                        field.removeValue(index);
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </div>
                    <div className="size-full">
                      <Image
                        alt={`${field.name} thumbnail ${index + 1}`}
                        src={src}
                      />
                    </div>
                  </div>
                </SimpleErrorBoundary>
              );
            })}

            <SimpleErrorBoundary>
              <div
                aria-label="Upload image"
                className="grid items-center justify-center size-14 border border-theme-divider-3 bg-theme-surface-2 text-theme-t2 hover:border-theme-link-hover hover:text-theme-link-hover cursor-pointer"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                title="Upload image"
              >
                <AddIcon fontSize="large" />
              </div>
              <input
                accept="image/*"
                autoFocus
                capture="environment"
                className="hidden"
                multiple
                name={field.name}
                onChange={async (event) => {
                  const selectedFiles = event?.target?.files || [];

                  const files = [...selectedFiles].map((file) => {
                    return {
                      file,
                      previewUrl: URL.createObjectURL(file),
                    };
                  });

                  return field.handleChange([...field.value, ...files]);
                }}
                placeholder="Input name..."
                ref={fileInputRef}
                type="file"
              />
            </SimpleErrorBoundary>
          </>
        );
      }}
    </form.ArrayField>
  );
};
