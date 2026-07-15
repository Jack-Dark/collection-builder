import z from 'zod';

const getCustomFieldSchema = {
  enabled: (num: number) => {
    return z.boolean().describe(`Custom Field ${num} Enabled`);
  },
  label: (num: number) => {
    return z.string().nullable().describe(`Custom Field ${num} Label`);
  },
};

export const baseCollectionSchema = z.object({
  customField1Enabled: getCustomFieldSchema.enabled(1),
  customField1Label: getCustomFieldSchema.label(1),
  customField2Enabled: getCustomFieldSchema.enabled(2),
  customField2Label: getCustomFieldSchema.label(2),
  customField3Enabled: getCustomFieldSchema.enabled(3),
  customField3Label: getCustomFieldSchema.label(3),
  name: z.string().describe('Name').min(1),
  notes: z.string().describe('Notes'),
});
