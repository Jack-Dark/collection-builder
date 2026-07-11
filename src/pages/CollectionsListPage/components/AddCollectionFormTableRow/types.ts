import type z from 'zod';

import type { collectionFormSchema } from '#/pages/CollectionsListPage/collection-form.schema';

export type AddCollectionFormSchemaDef = z.output<typeof collectionFormSchema>;
