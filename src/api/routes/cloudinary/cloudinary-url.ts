import type { CropMode } from 'cloudinary';

import { Cloudinary } from '@cloudinary/url-gen';

const cloudinaryUrl = new Cloudinary({
  cloud: {
    cloudName: 'collection-builder',
  },
});

export const createCloudinaryUrl = (
  props: {
    cropMode?: CropMode;
    height?: number;
    publicId: string;
    width?: number;
  },
  ...transformations: string[]
) => {
  const { cropMode = 'limit', height, publicId, width } = props;

  const cloudinary = cloudinaryUrl.image(publicId);

  if (height || width) {
    cloudinary.addTransformation(
      [`c_${cropMode}`, width && `w_${width}`, height && `h_${height}`]
        .filter(Boolean)
        .join(),
    );
  }

  transformations.forEach((transform) => {
    cloudinary.addTransformation(transform);
  });

  return cloudinary.toURL();
};

export const thumbnailSize = 100;
