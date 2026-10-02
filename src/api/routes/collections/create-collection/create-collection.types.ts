import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { createCollectionDbQuery } from './create-collection.db-query';
import type {
  createCollectionDbArgsSchema as createCollectionDbQueryArgsSchema,
  createCollectionFormSchema,
  createCollectionServerFnSchema,
} from './create-collection.schema';

export type CreateCollectionFormDataSchemaDef = z.output<
  typeof createCollectionFormSchema
>;

export type OnCreateCollectionRequestArgsDef = z.output<
  typeof createCollectionServerFnSchema
>;

export type CreateCollectionDbQueryArgsDef = z.output<
  typeof createCollectionDbQueryArgsSchema
>;

export type CreateCollectionResponseDef = QueryResponseDef<
  typeof createCollectionDbQuery
>;
