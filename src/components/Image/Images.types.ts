export type ImagePropsDef = {
  alt: string;
  onClick?: () => void;
} & (
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
    }
);
