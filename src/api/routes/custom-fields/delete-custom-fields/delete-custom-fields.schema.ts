import z from 'zod';

export const deleteCustomFieldsSchema = z.object({
  ids: z
    .array(z.number().describe('Custom Field ID'))
    .min(1)
    .describe('Custom Field IDs'),
});
