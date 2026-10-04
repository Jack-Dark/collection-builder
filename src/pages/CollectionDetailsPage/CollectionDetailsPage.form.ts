import { formOptions } from '@tanstack/react-form';
import { v4 as uuidv4 } from 'uuid';

import type { CreateCollectionItemsFormDataSchemaDef } from '#/api/routes/collection-items/create-collection-item/create-collection-item.types';

import type { CreateOrUpdateCollectionItemFormDataDef } from './CollectionDetailsPage.types';

import { createOrUpdateCollectionItemsFormSchema } from './CollectionDetailsPage.schema';

export const createNewCollectionItem = ({
  collectionId,
}: {
  collectionId: number;
}): CreateCollectionItemsFormDataSchemaDef => {
  const id = uuidv4();

  return {
    collectionId,
    customField1Value: '',
    customField2Value: '',
    customField3Value: '',
    editionDetails: '',
    id,
    images: [],
    isEditing: true,
    isSpecialEdition: Boolean(),
    name: '',
    notes: '',
  };
};

export const createOrUpdateCollectionItemsFormDefaultValues: CreateOrUpdateCollectionItemFormDataDef =
  {
    collectionItems: [],
  };

export const createOrUpdateCollectionItemsFormOptions = formOptions({
  defaultValues: createOrUpdateCollectionItemsFormDefaultValues,
  formId: 'collection-items',
  validators: [
    {
      run: createOrUpdateCollectionItemsFormSchema,
      triggers: ['change'],
    },
  ],
});
