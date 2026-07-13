import type { CreateCollectionItemCloudinaryTagsPropsDef } from './create-collection-item-cloudinary-tags.types';

export const createCollectionItemCloudinaryTags = (
  props: CreateCollectionItemCloudinaryTagsPropsDef,
) => {
  const { collectionId, collectionItemId, userId } = props;

  return [
    `collection-item-${collectionItemId}`,
    `user-${userId}`,
    `collection-${collectionId}`,
  ];
};
