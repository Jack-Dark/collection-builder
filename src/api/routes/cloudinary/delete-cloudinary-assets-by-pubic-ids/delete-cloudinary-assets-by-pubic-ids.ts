import { createServerFn } from '@tanstack/react-start';

import { deleteCloudinaryAssetsByPublicIds } from '#/lib/cloudinary';

import { deleteCloudinaryAssetsByPublicIdsSchema } from './delete-cloudinary-assets-by-pubic-ids.schema';

export const deleteCloudinaryAssetsByPublicIdsServerFn = createServerFn({
  method: 'POST',
})
  .validator(deleteCloudinaryAssetsByPublicIdsSchema)
  .handler(async ({ data }) => {
    await deleteCloudinaryAssetsByPublicIds(...data.publicIds);
  });
