import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { ComboboxField } from '#/components/Fields/ComboboxField';
import { InputField } from '#/components/Fields/InputField';
import { SwitchField } from '#/components/Fields/SwitchField';
import { TextAreaField } from '#/components/Fields/TextAreaField';

import type { CreateOrUpdateCollectionItemFormDataDef } from './CreateOrUpdateCollectionItemForm.types';

export const tempNewCollectionItemId = uuidv4();

export const addCollectionItemFormDefaultValues: CreateOrUpdateCollectionItemFormDataDef =
  {
    // @ts-expect-error
    collectionId: undefined,
    createdAt: undefined,
    customField1Value: '',
    customField2Value: '',
    customField3Value: '',
    deletedAt: undefined,
    editionDetails: '',
    id: tempNewCollectionItemId,
    images: [],
    isSpecialEdition: Boolean(),
    name: '',
    notes: '',
    updatedAt: undefined,
    userId: undefined,
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
