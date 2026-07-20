import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { v4 as uuidv4 } from 'uuid';

import type { CreateCollectionFormDataSchemaDef } from '#/api/routes/collections/create-collection/create-collection.types';

import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { ComboboxField } from '#/components/Fields/ComboboxField';
import { InputField } from '#/components/Fields/InputField';
import { SwitchField } from '#/components/Fields/SwitchField';
import { TextAreaField } from '#/components/Fields/TextAreaField';

import type { CreateOrUpdateCollectionFormDataSchemaDef } from './CollectionsListPage.types';

export const createNewCollection = (): CreateCollectionFormDataSchemaDef => {
  const id = uuidv4();

  return {
    customField1Enabled: false,
    customField1Label: '',
    customField2Enabled: false,
    customField2Label: '',
    customField3Enabled: false,
    customField3Label: '',
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

export const {
  fieldContext: collectionsListFormFieldContext,
  formContext: collectionsListFormContext,
  useFieldContext: useCollectionsListFormFieldContext,
  useFormContext: useCollectionsListFormContext,
} = createFormHookContexts();

export const {
  useAppForm: useCollectionsListForm,
  withForm: withCollectionsListForm,
} = createFormHook({
  fieldComponents: {
    CheckboxField,
    ComboboxField,
    InputField,
    SwitchField,
    TextAreaField,
  },
  fieldContext: collectionsListFormFieldContext,
  formComponents: {
    Button,
  },
  formContext: collectionsListFormContext,
});
