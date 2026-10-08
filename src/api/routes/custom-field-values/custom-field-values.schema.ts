import z from 'zod';

export const customFieldValueSchema = z
  .union([z.number(), z.string(), z.boolean()])
  .describe('Custom Field Value');

export const customFieldValuesFormSchema = z.union([
  z.record(
    z.number(),
    z
      .object({
        data: z
          .object({
            value: customFieldValueSchema,
          })
          .describe('Custom Field Value ID'),
        id: z.number().min(1).describe('Custom Field Value ID'),
      })
      .optional(),
  ),
]);
