import z from 'zod';

export const getCustomFieldValuesByCustomFieldIdSchema = z.object({
  id: z.number().min(1).describe('Custom Field ID'),
});
