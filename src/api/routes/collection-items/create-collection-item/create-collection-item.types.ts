import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { createCollectionItemsDbQuery } from './create-collection-item.db-query';
import type {
  createCollectionItemsFormSchema,
  createCollectionItemsServerFnSchema,
  onCreateCollectionItemsArgsSchema,
} from './create-collection-item.schema';

export type CreateCollectionItemsFormDataSchemaDef = z.output<
  typeof createCollectionItemsFormSchema
>;

export type OnCreateCollectionItemsArgsDef = z.output<
  typeof onCreateCollectionItemsArgsSchema
>;

export type CreateCollectionItemsRequestArgsDef = z.output<
  typeof createCollectionItemsServerFnSchema
>;

export type CreateCollectionItemsResponseDef = QueryResponseDef<
  typeof createCollectionItemsDbQuery
>;
