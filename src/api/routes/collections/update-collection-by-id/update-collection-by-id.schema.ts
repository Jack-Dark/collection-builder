import z from 'zod';

import { baseCollectionSchema } from '../base-collection.schema';

const updateCollectionByIdBaseSchema = baseCollectionSchema.extend({
  createdAt: z.string().describe('Created At').min(1),
  id: z.number().describe('ID').min(1),
  updatedAt: z.string().describe('Updated At').min(1),
  userId: z.string().describe('User ID').min(1),
});

export const updateCollectionByIdFormSchema = updateCollectionByIdBaseSchema;

export const updateCollectionByIdServerFnSchema =
  updateCollectionByIdBaseSchema;
