import type z from 'zod';

import type { createOrUpdateCollectionFormSchema } from '#/pages/CollectionsListPage/collection-form.schema';

export type CreateOrUpdateCollectionFormDataSchemaDef = z.output<
  typeof createOrUpdateCollectionFormSchema
>;
