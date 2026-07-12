import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { createCollectionDbQuery } from './create-collection.db-query';
import type { createCollectionSchema } from './create-collection.schema';

export type CreateCollectionRequestArgsDef = z.output<
  typeof createCollectionSchema
>;

export type CreateCollectionResponseDef = QueryResponseDef<
  typeof createCollectionDbQuery
>;
