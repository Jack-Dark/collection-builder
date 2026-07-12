import type z from 'zod';

import type { addOrUpdateCollectionItemFormSchema } from '#/api/routes/collection-items/server/addOrUpdateCollectionItemFormSchema';

export type AddCollectionItemFormSchemaDef = z.output<
  typeof addOrUpdateCollectionItemFormSchema
>;
