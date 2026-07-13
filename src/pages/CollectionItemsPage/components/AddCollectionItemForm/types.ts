import type z from 'zod';

import type { addOrUpdateCollectionItemFormSchema } from '../../addOrUpdateCollectionItemForm.schema';

export type AddCollectionItemFormSchemaDef = z.output<
  typeof addOrUpdateCollectionItemFormSchema
>;
