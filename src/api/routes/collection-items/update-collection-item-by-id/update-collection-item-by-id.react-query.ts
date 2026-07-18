import type { GenericMutateQueryProps } from '#/api/react-query-hooks/use-generic-mutate-query/use-generic-mutate-query.types';

import { useGenericMutateQuery } from '#/api/react-query-hooks/use-generic-mutate-query';

import type { OnUpdateCollectionItemsArgsDef } from './update-collection-item-by-id.types';

import { deleteCloudinaryAssetsByPublicIdsServerFn } from '../../cloudinary/delete-cloudinary-assets-by-pubic-ids';
import { createCloudinaryTags } from '../../cloudinary/helpers/create-collection-item-cloudinary-tags';
import { uploadFileToCloudinary } from '../../cloudinary/helpers/upload-file-to-cloudinary';
import { updateCollectionItemsServerFn } from './update-collection-item-by-id.serverFn';

export const useUpdateCollectionItems = <
  TTransformedData = OnUpdateCollectionItemsArgsDef[],
>(
  props?: GenericMutateQueryProps<
    OnUpdateCollectionItemsArgsDef[],
    OnUpdateCollectionItemsArgsDef[],
    TTransformedData
  >,
) => {
  const { onMutate: onUpdateCollectionItems, ...rest } = useGenericMutateQuery({
    fallbackErrorMessage: 'Unable to update collection item.',
    mutationFn: async (formRecords) => {
      const uploadedPublicIds: string[][] = [];

      try {
        // ? upload images to Cloudinary
        // ? Currently not possible to do via server function except via form data, which is not ideal for bulk uploads:
        // ? https://github.com/TanStack/router/issues/5704
        // ? https://www.answeroverflow.com/m/1433076253208084571
        const recordsWithImages = await Promise.all(
          formRecords.map(async (record) => {
            const {
              collectionId,
              id: collectionItemId,
              images,
              userId,
            } = record;

            const tags = createCloudinaryTags({
              collectionId,
              collectionItemId,
              userId,
            });

            const uploadedPublicIdsForRecord: string[] = [];

            const updatedImages = await Promise.all(
              images.map(async (image) => {
                if (typeof image === 'string') {
                  return image;
                } else {
                  const { public_id } = await uploadFileToCloudinary({
                    file: image.file,
                    tags,
                  });

                  uploadedPublicIdsForRecord.push(public_id);

                  return public_id;
                }
              }),
            );

            uploadedPublicIds.push(uploadedPublicIdsForRecord);

            return { ...record, images: updatedImages };
          }),
        );

        return updateCollectionItemsServerFn({
          data: {
            allUploadedPublicIds: uploadedPublicIds,
            records: recordsWithImages,
          },
        });
      } catch (error: unknown) {
        // ? Delete uploaded files on error
        await deleteCloudinaryAssetsByPublicIdsServerFn({
          data: { publicIds: uploadedPublicIds.flat() },
        });

        return [];
      }
    },
    mutationKey: ['update-collection-item'],
    showLoading: true,
    ...props,
  });

  return { ...rest, onUpdateCollectionItems };
};
