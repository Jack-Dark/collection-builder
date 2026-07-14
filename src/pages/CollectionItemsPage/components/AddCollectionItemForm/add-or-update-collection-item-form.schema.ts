import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/CheckboxField';
import { ComboboxField } from '#/components/ComboboxField';
import { InputField } from '#/components/InputField';
import { SwitchField } from '#/components/SwitchField';
import { TextAreaField } from '#/components/TextAreaField';

import type { AddOrUpdateCollectionItemFormSchemaDef } from './types';

export const addCollectionItemFormDefaultValues: AddOrUpdateCollectionItemFormSchemaDef =
  {
    // @ts-expect-error
    collectionId: undefined,
    createdAt: undefined,
    customField1Value: '',
    customField2Value: '',
    customField3Value: '',
    editionDetails: '',
    id: undefined,
    images: [],
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
    SwitchField,
    TextAreaField,
  },
  fieldContext: addCollectionFormFieldContext,
  formComponents: {
    Button,
  },
  formContext: addCollectionFormContext,
});
