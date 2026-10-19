import z from 'zod';

export const updateUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
});
