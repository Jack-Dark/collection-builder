import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/CheckboxField';
import { ComboboxField } from '#/components/ComboboxField';
import { InputField } from '#/components/InputField';
import { TextAreaField } from '#/components/TextAreaField';

import type { AddCollectionItemFormSchemaDef } from './types';

export const addCollectionItemFormDefaultValues: AddCollectionItemFormSchemaDef =
  {
    collectionId: 0,
    createdAt: undefined,
    customField1Value: '',
    customField2Value: '',
    customField3Value: '',
    editionDetails: '',
    id: undefined,
    isSpecialEdition: Boolean(),
    name: '',
    notes: '',
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
    TextAreaField,
  },
  fieldContext: addCollectionFormFieldContext,
  formComponents: {
    Button,
  },
  formContext: addCollectionFormContext,
});
