import z from 'zod';

import { getRequiredPaginationQueriesSchema } from '#/api/pagination/pagination.schema';

import type { CustomFieldColumnDef } from '../custom-fields.types';

export const getCustomFieldsSchema = z.object({
  params: getRequiredPaginationQueriesSchema<CustomFieldColumnDef>('name'),
});
