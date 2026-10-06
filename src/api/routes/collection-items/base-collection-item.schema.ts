import z from 'zod';

import { customFieldValuesFormSchema } from '../custom-field-values/custom-field-values.schema';

export const baseCollectionItemSchema = z.object({
  collectionId: z.number().min(1).describe('Collection ID'),
  customFieldValues: customFieldValuesFormSchema,
  editionDetails: z.string().describe('Edition details'),
  isSpecialEdition: z.boolean().describe('Is special edition'),
  name: z.string().describe('Name').min(1),
  notes: z.string().describe('Notes'),
});

const imagesBaseSchema = {
  newImageDetails: z
    .object({
      file: z.file().describe('Image file'),
      previewUrl: z.string().describe('Image preview URL'),
    })
    .describe('New image details'),
  publicId: z.string().describe('Image public ID'),
};

export const imagesSchema = {
  ...imagesBaseSchema,
  filesList: z.array(imagesBaseSchema.newImageDetails).describe('Images'),
  filesOrPublicIdsList: z
    .array(
      z.union([imagesBaseSchema.publicId, imagesBaseSchema.newImageDetails]),
    )
    .describe('Images'),
  publicIdsList: z.array(imagesBaseSchema.publicId).describe('Images'),
};
