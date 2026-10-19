import z from 'zod';

export const sendVerificationEmailSchema = z.object({
  url: z.string(),
  email: z.email(),
  name: z.string(),
});
