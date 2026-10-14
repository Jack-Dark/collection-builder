import z from 'zod';

export const customFieldValueSchema = z
  .union([z.number(), z.string(), z.boolean()])
  .describe('Custom Field Value');

export const customFieldValuesFormSchema = z.union([
  z.record(
    z.number(),
    z
      .object({
        id: z.number().min(1).describe('Custom Field Value ID'),
        valueBoolean: z.boolean().nullable().describe('Custom Field Value'),
        valueNumber: z.number().nullable().describe('Custom Field Value'),
        valueText: z.string().nullable().describe('Custom Field Value'),
      })
      .optional(),
  ),
]);
