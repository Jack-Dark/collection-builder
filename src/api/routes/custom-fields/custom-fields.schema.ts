import z from 'zod';

export const customFieldTypeSchema = z
  .union([z.literal('boolean'), z.literal('number'), z.literal('string')])
  .describe('Type');

export const baseCustomFieldSchema = z.object({
  name: z.string().describe('Name').min(1),
  type: customFieldTypeSchema,
});

export const customFieldWithIdSchema = baseCustomFieldSchema.extend({
  id: z.number().min(1).describe('ID'),
});
