import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/CheckboxField';
import { InputField } from '#/components/InputField';
import { TextAreaField } from '#/components/TextAreaField';

import type { AddCollectionFormSchemaDef } from './types';

export const addCollectionFormDefaultValues: AddCollectionFormSchemaDef = {
  customField1Enabled: false,
  customField1Label: '',
  customField1Required: false,
  customField2Enabled: false,
  customField2Label: '',
  customField2Required: false,
  customField3Enabled: false,
  customField3Label: '',
  customField3Required: false,
  name: '',
  notes: '',
};

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
