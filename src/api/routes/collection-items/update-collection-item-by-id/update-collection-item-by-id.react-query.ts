import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { CollectionItemRecordDef } from '../collection-item.types';
import type { UpdateCollectionItemSchemaDef } from './update-collection-item-by-id.types';

import {
  chunkAndUploadFileToCloudinary,
  createCollectionItemCloudinaryTags,
} from '../../cloudinary/TEMP';
import { useInvalidateGetCollectionDetailsById } from '../get-collection-details-by-id/get-collection-details-by-id.react-query';
import { updateCollectionItemByIdServerFn } from './update-collection-item-by-id.serverFn';

export const useUpdateCollectionItemById = <
  TTransformedData = CollectionItemRecordDef,
>(
  props?: GenericMutateQueryProps<
    UpdateCollectionItemSchemaDef,
    CollectionItemRecordDef,
    TTransformedData
  >,
) => {
  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { onMutate: onUpdateCollectionItemById, ...rest } =
    useGenericMutateQuery({
      fallbackErrorMessage: 'Unable to update collection item.',
      mutationFn: async (data) => {
        const { collectionId, id: collectionItemId, userId } = data;

        const imageSources: string[] = await Promise.all(
          data.images.map(async (image) => {
            if (typeof image === 'string') {
              return image;
            } else {
              const tags = createCollectionItemCloudinaryTags({
                collectionId,
                collectionItemId,
                userId,
              });
              const response = await chunkAndUploadFileToCloudinary({
                file: image.file,
                tags,
              });

              return response.url;
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
      onSuccess: async (...args) => {
        await invalidateGetCollectionDetailsById();

        await props?.onSuccess?.(...args);
      },
    });

  return { ...rest, onUpdateCollectionItemById };
};
