import z from 'zod';

export const sendResetPasswordEmailSchema = z.object({
  url: z.string(),
  name: z.string(),
  email: z.email(),
});
