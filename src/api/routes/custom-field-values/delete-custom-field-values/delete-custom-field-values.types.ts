import type z from 'zod';

import type { deleteCustomFieldValuesDbQuery } from './delete-custom-field-values.db-query';
import type { deleteCustomFieldValuesSchema } from './delete-custom-field-values.schema';

export type DeleteCustomFieldValuesRequestArgsDef = z.output<
  typeof deleteCustomFieldValuesSchema
>;

export type DeleteCustomFieldValuesResponseDef = Awaited<
  ReturnType<typeof deleteCustomFieldValuesDbQuery>
>;
