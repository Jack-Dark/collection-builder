import z from 'zod';

export const deleteCustomFieldsSchema = z.object({
  ids: z.array(z.number()).describe('Custom Field IDs'),
});

export const deleteCustomFieldsDbQuerySchema = deleteCustomFieldsSchema.extend({
  userId: z.string().min(1).describe('User ID'),
});
