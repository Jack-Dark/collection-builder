import type z from 'zod';

import type { collectionFormSchema } from '#/api/routes/collections/server/serverFns';

export type AddCollectionFormSchemaDef = z.output<typeof collectionFormSchema>;
