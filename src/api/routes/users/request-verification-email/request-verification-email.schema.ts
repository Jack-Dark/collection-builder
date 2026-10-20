import z from 'zod';

export const requestVerificationEmailRequestSchema = z.object({
  email: z.email(),
});
