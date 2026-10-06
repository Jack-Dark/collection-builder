import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { getCustomFieldValuesByCustomFieldIdDbQuery } from './get-custom-field-values-by-collection-id.db-query';
import type {
  getCustomFieldValuesByCustomFieldIdDbQuerySchema,
  getCustomFieldValuesByCustomFieldIdSchema,
} from './get-custom-field-values-by-collection-id.schema';

export type GetCustomFieldValuesByCustomFieldIdRequestArgsDef = z.output<
  typeof getCustomFieldValuesByCustomFieldIdSchema
>;

export type GetCustomFieldValuesByCustomFieldIdResponseDef = QueryResponseDef<
  typeof getCustomFieldValuesByCustomFieldIdDbQuery
>;

export type GetCustomFieldValuesByCustomFieldIdDbQueryArgsDef = z.output<
  typeof getCustomFieldValuesByCustomFieldIdDbQuerySchema
>;
