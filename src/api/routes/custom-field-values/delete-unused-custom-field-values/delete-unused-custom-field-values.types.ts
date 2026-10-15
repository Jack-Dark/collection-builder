import type z from 'zod';

import type { deleteUnusedCustomFieldValuesDbQuery } from './delete-unused-custom-field-values.db-query';
import type { deleteUnusedCustomFieldValuesSchema } from './delete-unused-custom-field-values.schema';

export type DeleteUnusedCustomFieldValuesRequestArgsDef = z.output<
  typeof deleteUnusedCustomFieldValuesSchema
>;

export type DeleteUnusedCustomFieldValuesResponseDef = Awaited<
  ReturnType<typeof deleteUnusedCustomFieldValuesDbQuery>
>;
