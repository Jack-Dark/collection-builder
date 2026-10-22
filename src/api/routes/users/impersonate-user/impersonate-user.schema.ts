import z from 'zod';

export const impersonateUserRequestSchema = z.object({
  userId: z.string().min(1),
});
