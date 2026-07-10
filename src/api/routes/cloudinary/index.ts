// https://api.cloudinary.com/v1_1/<cloud name>/<resource_type>/upload

import { createServerFn } from '@tanstack/react-start';
import z from 'zod';

import { authApiRouteMiddleware } from '#/auth/auth-middleware';
import { configs } from '#/configs';

const uploadCollectionItemImageSchema = z.object({
  collectionId: z.number(),
  collectionItemId: z.number(),
  /** Blobs */
  files: z.array(z.string()),
});

type UploadCollectionItemImageSchemaDef = z.output<
  typeof uploadCollectionItemImageSchema
>;

export const createCollectionItemServerFn = createServerFn({
  method: 'POST',
})
  .middleware([authApiRouteMiddleware])
  .validator(uploadCollectionItemImageSchema)
  .handler(async ({ context, data, method }) => {
    const { collectionId, collectionItemId, files } = data;

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${configs.cloudinaryCloudName}>/image/upload/user-${context.user.id}/collection-${collectionId}/item-${collectionItemId}`,
      {
        method,
        //   headers: {
        //     accept: 'application/json',
        //     Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        //   },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    return response.json();
  });
