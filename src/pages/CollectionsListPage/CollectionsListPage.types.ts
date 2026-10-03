import type { ReactFormType } from '@tanstack/react-form';
import type z from 'zod';

import type { createOrUpdateCollectionFormSchema } from '#/pages/CollectionsListPage/collection-form.schema';

import type { createOrUpdateCollectionFormOptions } from './CollectionsListPage.form';

export type CreateOrUpdateCollectionFormDataSchemaDef = z.output<
  typeof createOrUpdateCollectionFormSchema
>;

export type CreateOrUpdateCollectionFormRecordDef =
  CreateOrUpdateCollectionFormDataSchemaDef['records'][number];

export type CreateOrUpdateCollectionFormTypeDef = ReactFormType<
  typeof createOrUpdateCollectionFormOptions
>;
