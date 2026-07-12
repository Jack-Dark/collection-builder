import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { deleteCollectionDbQuery } from './delete-collection-by-id.db-query';
import type { deleteCollectionByIdSchema } from './delete-collection-by-id.schema';

export type DeleteCollectionByIdRequestArgsDef = z.output<
  typeof deleteCollectionByIdSchema
>;

export type DeleteCollectionResponseDef = QueryResponseDef<
  typeof deleteCollectionDbQuery
>;
