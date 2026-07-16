import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { createCollectionItemDbQuery } from './create-collection-item.db-query';
import type {
  createCollectionItemFormSchema,
  createCollectionItemServerFnSchema,
} from './create-collection-item.schema';

export type CreateCollectionItemFormSchemaDef = z.output<
  typeof createCollectionItemFormSchema
>;

export type CreateCollectionItemRequestArgsDef = z.output<
  typeof createCollectionItemServerFnSchema
>;

export type CreateCollectionItemResponseDef = QueryResponseDef<
  typeof createCollectionItemDbQuery
>;
