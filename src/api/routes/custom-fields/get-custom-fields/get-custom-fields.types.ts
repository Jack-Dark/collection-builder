import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { getCustomFieldsDbQuery } from './get-custom-fields.db-query';
import type { getCustomFieldsSchema } from './get-custom-fields.schema';

export type GetCustomFieldsRequestArgsDef = z.output<
  typeof getCustomFieldsSchema
>;

export type GetCustomFieldsResponseDef = QueryResponseDef<
  typeof getCustomFieldsDbQuery
>;
