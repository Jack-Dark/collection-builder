import type { createCollectionItemSchema } from '#/api/routes/collection-items/server/serverFns';
import type z from 'zod';

export type AddGameFormSchemaDef = z.Infer<typeof createCollectionItemSchema>;
