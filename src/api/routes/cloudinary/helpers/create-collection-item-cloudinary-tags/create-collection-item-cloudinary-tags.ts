import type { CreateCollectionItemCloudinaryTagsPropsDef } from './create-collection-item-cloudinary-tags.types';

export const createCloudinaryTags = (
  props: CreateCollectionItemCloudinaryTagsPropsDef,
) => {
  const { collectionId, collectionItemId, userId } = props;

  return [
    `user-${userId}`,
    `collection-${collectionId}`,
    createCollectionItemCloudinaryTag(collectionItemId),
  ];
};

export const createCollectionItemCloudinaryTag = (collectionItemId: number) => {
  return `collection-item-${collectionItemId}`;
};
