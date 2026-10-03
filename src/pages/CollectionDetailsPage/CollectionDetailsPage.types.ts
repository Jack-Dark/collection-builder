import type { ReactFormType } from '@tanstack/react-form';
import type z from 'zod';

import type { collectionDetailsFormOptions } from './CollectionDetailsPage.form';
import type { createOrUpdateCollectionItemFormSchema } from './CollectionDetailsPage.schema';

export type CreateOrUpdateCollectionItemFormDataDef = z.output<
  typeof createOrUpdateCollectionItemFormSchema
>;

export type CreateOrUpdateCollectionItemFormTypeDef = ReactFormType<
  typeof collectionDetailsFormOptions
>;
