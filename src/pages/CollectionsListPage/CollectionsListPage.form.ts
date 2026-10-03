import { formOptions } from '@tanstack/react-form';
import { v4 as uuidv4 } from 'uuid';

import type { CreateCollectionFormDataSchemaDef } from '#/api/routes/collections/create-collection/create-collection.types';

import type { CreateOrUpdateCollectionFormDataSchemaDef } from './CollectionsListPage.types';

import { createOrUpdateCollectionFormSchema } from './collection-form.schema';

export const createNewCollection = (): CreateCollectionFormDataSchemaDef => {
  const id = uuidv4();

  return {
    customField1Enabled: false,
    customField1Label: '',
    customField2Enabled: false,
    customField2Label: '',
    customField3Enabled: false,
    customField3Label: '',
    customFields: [],
    id,
    isEditing: true,
    name: '',
    notes: '',
  };
};

export const collectionsListFormDefaultValues: CreateOrUpdateCollectionFormDataSchemaDef =
  {
    records: [],
  };

export const createOrUpdateCollectionFormOptions = formOptions({
  defaultValues: collectionsListFormDefaultValues,
  formId: 'collections-list',
  validators: [
    {
      run: createOrUpdateCollectionFormSchema,
      triggers: ['change'],
    },
  ],
});
