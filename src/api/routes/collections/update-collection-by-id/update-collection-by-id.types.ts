import type z from 'zod';

import type {
  updateCollectionByIdFormSchema,
  updateCollectionByIdServerFnSchema,
} from './update-collection-by-id.schema';

export type UpdateCollectionFormSchemaDef = z.output<
  typeof updateCollectionByIdFormSchema
>;

export type UpdateCollectionResponseDef = z.output<
  typeof updateCollectionByIdServerFnSchema
>;
