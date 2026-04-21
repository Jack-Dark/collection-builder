import type { createCollectionSchema } from '#/api/routes/collections/server/serverFns';
import type z from 'zod';

export type AddCollectionFormSchemaDef = z.Infer<typeof createCollectionSchema>;
