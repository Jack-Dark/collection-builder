import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { deleteCustomFieldsDbQuery } from './delete-custom-fields.db-query';
import type {
  deleteCustomFieldsDbQuerySchema,
  deleteCustomFieldsSchema,
} from './delete-custom-fields.schema';

export type DeleteCustomFieldsRequestArgsDef = z.output<
  typeof deleteCustomFieldsSchema
>;

export type DeleteCustomFieldsResponseDef = QueryResponseDef<
  typeof deleteCustomFieldsDbQuery
>;

export type DeleteCustomFieldsDbQueryArgsDef = z.output<
  typeof deleteCustomFieldsDbQuerySchema
>;
