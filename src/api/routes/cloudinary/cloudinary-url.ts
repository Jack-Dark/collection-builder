import { Cloudinary } from '@cloudinary/url-gen';

export const createCloudinaryUrl = new Cloudinary({
  cloud: {
    cloudName: 'collection-builder',
  },
});
