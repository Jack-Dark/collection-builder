import { createCloudinaryUrl } from '#/api/routes/cloudinary/cloudinary-url';

import type { ImagePropsDef } from './Images.types';

export const Image = (props: ImagePropsDef) => {
  const {
    alt,
    height,
    onClick,
    publicId,
    src,
    transformations = [],
    width,
  } = props;

  let imgSrc = src;

  if (publicId) {
    imgSrc = createCloudinaryUrl(
      {
        height,
        publicId,
        width,
      },
      ...transformations,
    );
  }

  return (
    <div
      className={`w-full h-full overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <img alt={alt} className="w-full h-full object-contain" src={imgSrc} />
    </div>
  );
};
