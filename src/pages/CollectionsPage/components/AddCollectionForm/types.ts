import type z from 'zod';

import type { createCollectionSchema } from '#/api/routes/collections/server/serverFns';

export type AddCollectionFormSchemaDef = z.Infer<typeof createCollectionSchema>;
