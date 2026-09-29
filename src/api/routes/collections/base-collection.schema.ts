import z from 'zod';

const OLD_getCustomFieldSchema = {
  enabled: (num: number) => {
    return z.boolean().describe(`Custom Field ${num} Enabled`);
  },
  label: (num: number) => {
    return z.string().nullable().describe(`Custom Field ${num} Label`);
  },
};

export const baseCollectionSchema = z.object({
  customField1Enabled: OLD_getCustomFieldSchema.enabled(1),
  customField1Label: OLD_getCustomFieldSchema.label(1),
  customField2Enabled: OLD_getCustomFieldSchema.enabled(2),
  customField2Label: OLD_getCustomFieldSchema.label(2),
  customField3Enabled: OLD_getCustomFieldSchema.enabled(3),
  customField3Label: OLD_getCustomFieldSchema.label(3),
  name: z.string().describe('Name').min(1),
  notes: z.string().describe('Notes'),
});
