import { Cloudinary } from '@cloudinary/url-gen';

import { configs } from '#/configs';

export const cloudinaryUrl = new Cloudinary({
  cloud: {
    cloudName: configs.cloudinaryCloudName,
  },
});
