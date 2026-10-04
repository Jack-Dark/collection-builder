import type { ReactFormType } from '@tanstack/react-form';
import type z from 'zod';

import type { createOrUpdateCollectionItemsFormOptions } from './CollectionDetailsPage.form';
import type { createOrUpdateCollectionItemsFormSchema } from './CollectionDetailsPage.schema';

export type CreateOrUpdateCollectionItemFormDataDef = z.output<
  typeof createOrUpdateCollectionItemsFormSchema
>;

export type CreateOrUpdateCollectionItemFormRowDataDef =
  CreateOrUpdateCollectionItemFormDataDef['collectionItems'][number];

export type CreateOrUpdateCollectionItemFormTypeDef = ReactFormType<
  typeof createOrUpdateCollectionItemsFormOptions
>;
