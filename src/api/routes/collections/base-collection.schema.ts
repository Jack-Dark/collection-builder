import z from 'zod';

export const baseCollectionSchema = z.object({
  name: z.string().describe('Name').min(1),
  notes: z.string().describe('Notes'),
});
