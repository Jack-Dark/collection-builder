import z from 'zod';

export const baseCollectionItemSchema = z.object({
  collectionId: z.number().describe('Collection ID'),
  customField1Value: z.string().describe('[customField1Value] placeholder'),
  customField2Value: z.string().describe('[customField2Value] placeholder'),
  customField3Value: z.string().describe('[customField3Value] placeholder'),
  editionDetails: z.string().describe('Edition details'),
  images: z
    .array(
      z.union([z.string(), z.file().min(10000).max(1000000).mime('image/*')]),
    )
    .describe('Images'),
  isSpecialEdition: z.boolean().describe('Is special edition'),
  name: z.string().describe('Name').min(1),
  notes: z.string().describe('Notes'),
});
