import { Cloudinary } from '@cloudinary/url-gen';

const cloudinaryUrl = new Cloudinary({
  cloud: {
    cloudName: 'collection-builder',
  },
});

export const createCloudinaryUrl = (props: {
  publicId: string;
  transformations?: string;
}) => {
  const { publicId, transformations = '' } = props;

  return cloudinaryUrl
    .image(publicId)
    .addTransformation(transformations)
    .toURL();
};

export const createCloudinaryThumbnail = (props: {
  height?: number;
  publicId: string;
  width?: number;
}) => {
  const { height = 100, publicId, width = 100 } = props;

  return createCloudinaryUrl({
    publicId,
    transformations: `c_limit,w_${width},h_${height}`,
  });
};
