import type z from 'zod';

import type { createOrUpdateCollectionItemFormSchema } from './CreateOrUpdateCollectionItemForm.schema';

export type CreateOrUpdateCollectionItemFormDataDef = z.output<
  typeof createOrUpdateCollectionItemFormSchema
>;
