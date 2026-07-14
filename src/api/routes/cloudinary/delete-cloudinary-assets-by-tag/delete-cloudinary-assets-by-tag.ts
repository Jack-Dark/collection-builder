import { createServerFn } from '@tanstack/react-start';

import { deleteCloudinaryAssetsByTag } from '#/lib/cloudinary';

import { deleteCloudinaryAssetsByTagSchema } from './delete-cloudinary-assets-by-tag.schema';

export const deleteCloudinaryAssetsByTagServerFn = createServerFn({
  method: 'POST',
})
  .validator(deleteCloudinaryAssetsByTagSchema)
  .handler(async ({ data }) => {
    const result = await deleteCloudinaryAssetsByTag(data.tag);
    console.log('🚀 ~ result:', result);
  });
