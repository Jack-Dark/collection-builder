type ZoomableImagePropsDef =
  | {
      height?: never;
      publicId?: never;
      src: string;
      transformations?: never;
      width?: never;
    }
  | {
      height?: number;
      publicId: string;
      src?: never;
      transformations?: string[];
      width?: number;
    };

export type ZoomableThumbnailPropsDef = {
  alt: string;
  image: ZoomableImagePropsDef;
  thumbnail: ZoomableImagePropsDef;
};
