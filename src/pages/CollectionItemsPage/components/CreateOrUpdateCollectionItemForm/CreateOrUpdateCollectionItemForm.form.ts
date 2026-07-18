import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { v4 as uuidv4 } from 'uuid';

import type { CreateCollectionItemsFormDataSchemaDef } from '#/api/routes/collection-items/create-collection-item/create-collection-item.types';

import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { ComboboxField } from '#/components/Fields/ComboboxField';
import { InputField } from '#/components/Fields/InputField';
import { SwitchField } from '#/components/Fields/SwitchField';
import { TextAreaField } from '#/components/Fields/TextAreaField';

import type { CreateOrUpdateCollectionItemFormDataDef } from './CreateOrUpdateCollectionItemForm.types';

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

export const addCollectionItemFormDefaultValues: CreateOrUpdateCollectionItemFormDataDef =
  {
    collectionItems: [],
  };

export const {
  fieldContext: addCollectionFormFieldContext,
  formContext: addCollectionFormContext,
  useFieldContext: useAddCollectionItemFormFieldContext,
  useFormContext: useAddCollectionItemFormContext,
} = createFormHookContexts();

export const {
  useAppForm: useAddCollectionItemForm,
  withForm: withAddCollectionItemForm,
} = createFormHook({
  fieldComponents: {
    CheckboxField,
    ComboboxField,
    InputField,
    SwitchField,
    TextAreaField,
  },
  fieldContext: addCollectionFormFieldContext,
  formComponents: {
    Button,
  },
  formContext: addCollectionFormContext,
});
