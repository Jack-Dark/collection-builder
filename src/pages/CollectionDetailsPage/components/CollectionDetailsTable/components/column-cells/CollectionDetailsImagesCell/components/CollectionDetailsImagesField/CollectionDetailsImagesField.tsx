import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef } from 'react';

import { createCloudinaryUrl } from '#/api/routes/cloudinary/cloudinary-url';
import { Image } from '#/components/Image';
import { SimpleErrorBoundary } from '#/components/SimpleErrorBoundary';

import {
  addCollectionItemFormDefaultValues,
  withCollectionDetailsForm,
} from '../../../../../CollectionDetailsPage.form';

export const CollectionDetailsImagesField = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  props: { index: 0 },
  render: ({ form, index }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <form.AppField mode="array" name="collectionItems">
        {() => {
          return (
            <form.AppField name={`collectionItems[${index}].images`}>
              {(field) => {
                const { value } = field.state;

                return (
                  <>
                    {value.map((image, index) => {
                      let publicId = '';
                      let previewUrl = '';

                      if (typeof image === 'string') {
                        publicId = image;
                      } else {
                        previewUrl = image.previewUrl;
                      }

                      const src =
                        previewUrl || createCloudinaryUrl({ publicId });

                      return (
                        <SimpleErrorBoundary key={src}>
                          <div className="relative grid grid-rows-[auto_1fr] items-center p-1 size-14 bg-white border border-gray-400 text-gray-500">
                            <div
                              className="absolute right-0 top-0 flex justify-end p-4px bg-white border-l border-b border-gray-400 rounded-bl-sm text-lg hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                const images = [...value];
                                images.splice(index, 1);

                                return field.handleChange(images);
                              }}
                            >
                              <DeleteIcon fontSize="inherit" />
                            </div>
                            <div className="w-full h-full overflow-hidden">
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
                        className="grid items-center justify-center size-14 border border-gray-400 text-gray-500 cursor-pointer"
                        onClick={() => {
                          fileInputRef.current?.click();
                        }}
                        title="Upload"
                      >
                        <AddIcon fontSize="large" />
                      </div>
                      <input
                        accept=".jpg,.jpeg,.png,.webp"
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

                          return field.handleChange([...value, ...files]);
                        }}
                        placeholder="Input name..."
                        ref={fileInputRef}
                        type="file"
                      />
                    </SimpleErrorBoundary>
                  </>
                );
              }}
            </form.AppField>
          );
        }}
      </form.AppField>
    );
  },
});
