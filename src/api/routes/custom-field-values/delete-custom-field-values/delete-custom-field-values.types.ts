import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { deleteCustomFieldValuesDbQuery } from './delete-custom-field-values.db-query';
import type {
  deleteCustomFieldValuesDbQuerySchema,
  deleteCustomFieldValuesSchema,
} from './delete-custom-field-values.schema';

export type DeleteCustomFieldValuesRequestArgsDef = z.output<
  typeof deleteCustomFieldValuesSchema
>;

export type DeleteCustomFieldValuesResponseDef = QueryResponseDef<
  typeof deleteCustomFieldValuesDbQuery
>;

export type DeleteCustomFieldValuesDbQueryArgsDef = z.output<
  typeof deleteCustomFieldValuesDbQuerySchema
>;
