import z from 'zod';

export const authSchema = z
  .object({
    id: z.string().min(1).describe('User ID'),
    image: z.string().describe('User image').nullable().optional(),
    name: z.string().describe('User name'),
  })
  .describe('User context');
