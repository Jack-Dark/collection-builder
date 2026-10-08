import type z from 'zod';

import type { QueryResponseDef } from '#/api/db-tables-schema.types';

import type { getCollectionsWithCustomFieldsDbQuery } from './get-collections-with-custom-field.db-query';
import type { getCollectionsWithCustomFieldsSchema } from './get-collections-with-custom-field.schema';

export type GetCollectionsWithCustomFieldsRequestArgsDef = z.output<
  typeof getCollectionsWithCustomFieldsSchema
>;

export type GetCollectionsWithCustomFieldsResponseDef = QueryResponseDef<
  typeof getCollectionsWithCustomFieldsDbQuery
>;
