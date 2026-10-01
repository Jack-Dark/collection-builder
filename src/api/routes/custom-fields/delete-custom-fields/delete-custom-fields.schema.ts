import z from 'zod';

export const deleteCustomFieldsSchema = z.object({
  collectionId: z.number().describe('Collection ID'),
  ids: z.array(z.number()).describe('Custom Field IDs'),
});
