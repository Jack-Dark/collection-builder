import z from 'zod';

export const baseCollectionItemSchema = z.object({
  customField1Value: z.string().describe('Custom Field 1'),
  customField2Value: z.string().describe('Custom Field 2'),
  customField3Value: z.string().describe('Custom Field 3'),
  editionDetails: z.string().describe('Edition details'),
  isSpecialEdition: z.boolean().describe('Is special edition'),
  name: z.string().describe('Name').min(1),
  notes: z.string().describe('Notes'),
});

export const imagesSchema = {
  form: z
    .array(
      z.union([
        z.string(),
        z.object({
          file: z.file(),
          previewUrl: z.string(),
        }),
      ]),
    )
    .describe('Images'),
  serverFn: z.array(z.string()).describe('Images'),
};
