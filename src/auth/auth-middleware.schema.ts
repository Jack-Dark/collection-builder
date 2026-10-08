import z from 'zod';

export const authSchema = z
  .object({
    id: z.string().min(1).describe('User ID'),
    image: z.string().describe('User image').nullable().optional(),
    name: z.string().describe('User name'),
    token: z.string().describe('User token'),
  })
  .describe('User context');
