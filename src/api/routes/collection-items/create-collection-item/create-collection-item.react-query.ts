import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type {
  CreateCollectionItemFormSchemaDef,
  CreateCollectionItemResponseDef,
} from './create-collection-item.types';

import { createCloudinaryTags } from '../../cloudinary/helpers/create-collection-item-cloudinary-tags';
import { uploadFileToCloudinary } from '../../cloudinary/helpers/upload-file-to-cloudinary';
import { updateCollectionItemByIdServerFn } from '../update-collection-item-by-id/update-collection-item-by-id.serverFn';
import { createCollectionItemServerFn } from './create-collection-item.serverFn';

export const useCreateCollectionItem = <
  TTransformedData = CreateCollectionItemResponseDef,
>(
  props?: GenericMutateQueryProps<
    CreateCollectionItemFormSchemaDef,
    CreateCollectionItemResponseDef,
    TTransformedData
  >,
) => {
  const { onMutate: onCreateCollectionItem, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to add item to collection.',
    mutationFn: async (data) => {
      const images: string[] = [];
      const record = await createCollectionItemServerFn({
        data: { ...data, id: undefined, images },
      });

      const { collectionId, id: collectionItemId, userId } = record;

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
          ...record,
          images: imageSources,
        },
      });

      return updatedRecord;
    },
    mutationKey: ['create-collection-item'],
    showLoading: true,
    ...props,
  });

  return { ...rest, onCreateCollectionItem };
};
