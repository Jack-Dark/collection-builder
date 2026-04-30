import SaveIcon from '@mui/icons-material/Save';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useRef } from 'react';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/server/types';

import { useCreateCollectionItem } from '#/api/routes/collection-items/client/hooks';
import { createCollectionItemSchema } from '#/api/routes/collection-items/server/serverFns';
import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/CheckboxField';
import { ComboboxField } from '#/components/ComboboxField';
import { InputField } from '#/components/InputField';

import { defaultValues } from './constants';

type AddCollectionItemFormPropsDef = {
  collectionId: number;
  customField1Enabled: boolean | undefined;
  customField1Label: string | undefined;
  customField2Enabled: boolean | undefined;
  customField2Label: string | undefined;
  customField3Enabled: boolean | undefined;
  customField3Label: string | undefined;
  customFields: {
    customField1Values: string[];
    customField2Values: string[];
    customField3Values: string[];
  };
  lastAddedItem: CollectionItemRecordDef | undefined;
};

export const AddCollectionItemForm = (props: AddCollectionItemFormPropsDef) => {
  const {
    collectionId,
    customField1Enabled,
    customField1Label,
    customField2Enabled,
    customField2Label,
    customField3Enabled,
    customField3Label,
    customFields,
    lastAddedItem,
  } = props;

  const router = useRouter();

  const nameInput = useRef<HTMLInputElement>(null);

  const { onCreateCollectionItem } = useCreateCollectionItem();

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      collectionId,
      // ? prefill system field with last-added game's system
      customField1Value: lastAddedItem?.customField1Value || '',
      customField2Value: lastAddedItem?.customField2Value || '',
      customField3Value: lastAddedItem?.customField3Value || '',
    },
    onSubmit: async ({ value }) => {
      await onCreateCollectionItem({
        data: value,
      });

      form.reset();

      await router.invalidate();

      nameInput?.current?.focus();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: createCollectionItemSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div>
        <form.Subscribe
          selector={(state) => {
            return {
              errors: state.errors,
              value: state.values.name,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field name="name">
                {(field) => {
                  // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <InputField
                      autoFocus
                      error={errorMsg}
                      label="Name"
                      name={field.name}
                      onValueChange={field.handleChange}
                      ref={nameInput}
                      required
                      value={value}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>

        {customField1Enabled && (
          <form.Subscribe
            selector={(state) => {
              return {
                errors: state.errors,
                value: state.values.customField1Value,
              };
            }}
          >
            {({ errors, value }) => {
              return (
                <form.Field name="customField1Value">
                  {(field) => {
                    const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    return (
                      <ComboboxField
                        defaultValue={{ id: value, label: value }}
                        error={errorMsg}
                        items={customFields.customField1Values.map((label) => {
                          return { id: label, label };
                        })}
                        label={customField1Label}
                        onValueChange={(value) => {
                          field.setValue(String(value?.id));
                        }}
                        placeholder={`Select a ${customField1Label?.toLowerCase() || ''}...`}
                        required
                      />
                    );
                  }}
                </form.Field>
              );
            }}
          </form.Subscribe>
        )}

        {customField2Enabled && (
          <form.Subscribe
            selector={(state) => {
              return {
                errors: state.errors,
                value: state.values.customField2Value,
              };
            }}
          >
            {({ errors, value }) => {
              return (
                <form.Field name="customField2Value">
                  {(field) => {
                    const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    return (
                      <ComboboxField
                        defaultValue={{ id: value, label: value }}
                        error={errorMsg}
                        items={customFields.customField2Values.map((label) => {
                          return { id: label, label };
                        })}
                        label={customField2Label}
                        onValueChange={(value) => {
                          field.setValue(String(value?.id));
                        }}
                        placeholder={`Select a ${customField2Label?.toLowerCase() || ''}...`}
                        required
                      />
                    );
                  }}
                </form.Field>
              );
            }}
          </form.Subscribe>
        )}

        {customField3Enabled && (
          <form.Subscribe
            selector={(state) => {
              return {
                errors: state.errors,
                value: state.values.customField3Value,
              };
            }}
          >
            {({ errors, value }) => {
              return (
                <form.Field name="customField3Value">
                  {(field) => {
                    const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    return (
                      <ComboboxField
                        defaultValue={{ id: value, label: value }}
                        error={errorMsg}
                        items={customFields.customField3Values.map((label) => {
                          return { id: label, label };
                        })}
                        label={customField3Label}
                        onValueChange={(value) => {
                          field.setValue(String(value?.id));
                        }}
                        placeholder={`Select a ${customField3Label?.toLowerCase() || ''}...`}
                        required
                      />
                    );
                  }}
                </form.Field>
              );
            }}
          </form.Subscribe>
        )}

        <form.Subscribe
          selector={(state) => {
            return {
              errors: state.errors,
              value: state.values.isSpecialEdition,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field
                listeners={{
                  onChange: ({ value: isSpecialEdition }) => {
                    form.setFieldValue(
                      'editionDetails',
                      isSpecialEdition ? "Collector's Edition" : '',
                    );
                  },
                }}
                name="isSpecialEdition"
              >
                {(field) => {
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <CheckboxField
                      checked={value}
                      error={errorMsg}
                      label="Is this a special edition?"
                      onCheckedChange={field.handleChange}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>

        <form.Subscribe
          selector={(state) => {
            return {
              errors: state.errors,
              isSpecialEdition: state.values.isSpecialEdition,
              value: state.values.editionDetails,
            };
          }}
        >
          {({ errors, isSpecialEdition, value }) => {
            return (
              isSpecialEdition && (
                <form.Field name="editionDetails">
                  {(field) => {
                    const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    return (
                      <InputField
                        error={errorMsg}
                        label="Edition details"
                        name={field.name}
                        onValueChange={field.handleChange}
                        required
                        value={value}
                      />
                    );
                  }}
                </form.Field>
              )
            );
          }}
        </form.Subscribe>

        <form.Subscribe
          selector={(state) => {
            return {
              isFormValid: state.isFormValid,
              values: state.values,
            };
          }}
        >
          {(state) => {
            const { isFormValid } = state;

            return (
              <Button
                className="flex flex-nowrap gap-2"
                disabled={!isFormValid}
                type="submit"
              >
                <SaveIcon />
                Save
              </Button>
            );
          }}
        </form.Subscribe>
      </div>
    </form>
  );
};
