import type z from 'zod';

import type { addOrUpdateCollectionItemFormSchema } from '../../addOrUpdateCollectionItemForm.schema';

export type AddOrUpdateCollectionItemFormSchemaDef = z.output<
  typeof addOrUpdateCollectionItemFormSchema
>;
