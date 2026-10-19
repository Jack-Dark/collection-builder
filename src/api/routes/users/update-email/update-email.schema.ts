import z from 'zod';

export const updateEmailRequestSchema = z.object({
  newEmail: z.email(),
});
