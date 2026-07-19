import type z from 'zod';

import type { createOrUpdateCollectionItemFormSchema } from './CollectionDetailsPage.schema';

export type CreateOrUpdateCollectionItemFormDataDef = z.output<
  typeof createOrUpdateCollectionItemFormSchema
>;
