import { formOptions } from '@tanstack/react-form';
import { v4 as uuidv4 } from 'uuid';

import type { CreateCollectionItemsFormDataSchemaDef } from '#/api/routes/collection-items/create-collection-item/create-collection-item.types';

import type { CreateOrUpdateCollectionItemFormDataDef } from './CollectionDetailsPage.types';

import { createOrUpdateCollectionItemFormSchema } from './CollectionDetailsPage.schema';

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

export const collectionDetailsFormDefaultValues: CreateOrUpdateCollectionItemFormDataDef =
  {
    collectionItems: [],
  };

export const collectionDetailsFormOptions = formOptions({
  defaultValues: collectionDetailsFormDefaultValues,
  formId: 'collection-items',
  validators: [
    {
      run: createOrUpdateCollectionItemFormSchema,
      triggers: ['change'],
    },
  ],
});
