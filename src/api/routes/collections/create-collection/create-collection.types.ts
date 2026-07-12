import type z from 'zod';

import type { createCollectionSchema } from './create-collection.schema';

export type CreateCollectionSchemaDef = z.output<typeof createCollectionSchema>;
