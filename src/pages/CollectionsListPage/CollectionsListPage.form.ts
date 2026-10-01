import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { v4 as uuidv4 } from 'uuid';

import type { CreateCollectionFormDataSchemaDef } from '#/api/routes/collections/create-collection/create-collection.types';

import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { ComboboxField } from '#/components/Fields/ComboboxField';
import { ComboboxFieldV2 } from '#/components/Fields/ComboboxFieldV2';
import { InputField } from '#/components/Fields/InputField';
import { SelectField } from '#/components/Fields/SelectField';
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
    ComboboxFieldV2,
    InputField,
    SelectField,
    SwitchField,
    TextAreaField,
  },
  fieldContext: collectionsListFormFieldContext,
  formComponents: {
    Button,
  },
  formContext: collectionsListFormContext,
});
