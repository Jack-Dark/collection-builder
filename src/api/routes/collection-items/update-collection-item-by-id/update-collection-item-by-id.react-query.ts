import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { CollectionItemRecordDef } from '../collection-item.types';
import type { UpdateCollectionItemFormSchemaDef } from './update-collection-item-by-id.types';

import { createCloudinaryTags } from '../../cloudinary/helpers/create-collection-item-cloudinary-tags';
import { uploadFileToCloudinary } from '../../cloudinary/helpers/upload-file-to-cloudinary';
import { updateCollectionItemByIdServerFn } from './update-collection-item-by-id.serverFn';

export const useUpdateCollectionItemById = <
  TTransformedData = CollectionItemRecordDef,
>(
  props?: GenericMutateQueryProps<
    UpdateCollectionItemFormSchemaDef,
    CollectionItemRecordDef,
    TTransformedData
  >,
) => {
  const { onMutate: onUpdateCollectionItemById, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to update collection item.',
      mutationFn: async (data) => {
        const { collectionId, id: collectionItemId, userId } = data;

        // TODO - ADD DELETE LOGIC FOR REPLACED IMAGES
        const imageSources: string[] = await Promise.all(
          data.images.map(async (image) => {
            if (typeof image === 'string') {
              return image;
            } else {
              const tags = createCloudinaryTags({
                collectionId,
                collectionItemId,
                userId,
              });
              const { public_id } = await uploadFileToCloudinary({
                file: image.file,
                tags,
              });

              return public_id;
            }
          }),
        );
        const updatedRecord = updateCollectionItemByIdServerFn({
          data: {
            ...data,
            images: imageSources,
          },
        });

        return updatedRecord;
      },
      mutationKey: ['update-collection-item'],
      showLoading: true,
      ...props,
    });

  return { ...rest, onUpdateCollectionItemById };
};
