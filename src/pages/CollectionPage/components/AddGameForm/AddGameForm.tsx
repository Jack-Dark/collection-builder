import SaveIcon from '@mui/icons-material/Save';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useCreateCollectionItem } from '#/api/routes/collection-items/client/hooks';
import { createCollectionItemSchema } from '#/api/routes/collection-items/server/serverFns';
import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/CheckboxField';
import { ComboboxField } from '#/components/ComboboxField';
import { InputField } from '#/components/InputField';
import { useRef } from 'react';

import { systemsList, defaultValues } from './constants';

type AddGameFormProps = {
  lastAddedSystem: string | undefined;
};

export const AddGameForm = (props: AddGameFormProps) => {
  const { lastAddedSystem } = props;

  const router = useRouter();

  const nameInput = useRef<HTMLInputElement>(null);

  const { onCreateCollectionItem } = useCreateCollectionItem();

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      // ? prefill system field with last-added game's system
      system: lastAddedSystem || '',
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
        <form.Subscribe
          selector={(state) => {
            return {
              errors: state.errors,
              value: state.values.system,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field name="system">
                {(field) => {
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <ComboboxField
                      error={errorMsg}
                      items={systemsList}
                      label="System"
                      onValueChange={(value) => {
                        if (Array.isArray(value)) {
                          const [system] = value;
                          field.setValue(system);
                        } else if (value) {
                          field.setValue(value);
                        } else {
                          field.setValue('');
                        }
                      }}
                      placeholder="Select a system..."
                      required
                      value={value}
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
