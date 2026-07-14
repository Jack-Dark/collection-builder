import z from 'zod';

export const baseCollectionItemSchema = z.object({
  customField1Value: z.string().describe('[customField1Value] placeholder'),
  customField2Value: z.string().describe('[customField2Value] placeholder'),
  customField3Value: z.string().describe('[customField3Value] placeholder'),
  editionDetails: z.string().describe('Edition details'),
  isSpecialEdition: z.boolean().describe('Is special edition'),
  name: z.string().describe('Name').min(1),
  notes: z.string().describe('Notes'),
});
