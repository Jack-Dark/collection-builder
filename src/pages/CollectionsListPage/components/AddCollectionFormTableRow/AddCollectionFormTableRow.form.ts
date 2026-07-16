import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { v4 as uuidv4 } from 'uuid';

import type { CreateCollectionFormDataSchemaDef } from '#/api/routes/collections/create-collection/create-collection.types';

import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/Fields/CheckboxField';
import { InputField } from '#/components/Fields/InputField';
import { TextAreaField } from '#/components/Fields/TextAreaField';

import type { CreateOrUpdateCollectionFormDataSchemaDef } from './types';

export const tempNewCollectionId = uuidv4();

export const addCollectionFormDefaultValues: CreateOrUpdateCollectionFormDataSchemaDef =
  {
    createdAt: undefined,
    customField1Enabled: false,
    customField1Label: '',
    customField2Enabled: false,
    customField2Label: '',
    customField3Enabled: false,
    customField3Label: '',
    id: tempNewCollectionId,
    name: '',
    notes: '',
    updatedAt: undefined,
    userId: undefined,
  } satisfies CreateCollectionFormDataSchemaDef;

export const {
  fieldContext: addCollectionFormFieldContext,
  formContext: addCollectionFormContext,
  useFieldContext: useAddCollectionFormFieldContext,
  useFormContext: useAddCollectionFormContext,
} = createFormHookContexts();

export const {
  useAppForm: useAddCollectionForm,
  withForm: withAddCollectionForm,
} = createFormHook({
  fieldComponents: {
    CheckboxField,
    InputField,
    TextAreaField,
  },
  fieldContext: addCollectionFormFieldContext,
  formComponents: {
    Button,
  },
  formContext: addCollectionFormContext,
});
