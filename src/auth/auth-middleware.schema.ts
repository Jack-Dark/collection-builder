import z from 'zod';

export const authSchema = z.object({
  id: z.string().min(1),
  image: z.string().nullable().optional(),
  name: z.string(),
  role: z.union([z.literal('admin'), z.literal('user')]),
});

export const authAdminSchema = authSchema.extend({
  role: z.literal('admin'),
});
