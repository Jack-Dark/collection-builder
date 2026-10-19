import z from 'zod';

export const requestVerificationEmailRequestSchema = z.object({
  callbackURL: z.string(),
  email: z.email(),
});
