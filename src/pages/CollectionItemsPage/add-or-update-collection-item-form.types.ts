import type z from 'zod';

import type { createOrUpdateCollectionItemFormSchema } from './create-or-update-collection-item-form.schema';

export type CreateOrUpdateCollectionItemFormDataDef = z.output<
  typeof createOrUpdateCollectionItemFormSchema
>;
