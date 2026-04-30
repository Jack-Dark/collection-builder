import SaveIcon from '@mui/icons-material/Save';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useRef } from 'react';

import { useCreateCollection } from '#/api/routes/collections/client/hooks';
import { createCollectionSchema } from '#/api/routes/collections/server/serverFns';
import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/CheckboxField';
import { InputField } from '#/components/InputField';

import { defaultValues } from './constants';

export const AddCollectionForm = () => {
  const router = useRouter();

  const nameInputRef = useRef<HTMLInputElement>(null);

  const { onCreateCollection } = useCreateCollection();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onCreateCollection({
        data: value,
      });

      form.reset();

      await router.invalidate();

      nameInputRef?.current?.focus();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: createCollectionSchema,
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
                      ref={nameInputRef}
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
              value: state.values.notes,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field name="notes">
                {(field) => {
                  // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <InputField
                      error={errorMsg}
                      label="Notes"
                      name={field.name}
                      onValueChange={field.handleChange}
                      value={value}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>
        {([1, 2, 3] as const).map((num) => {
          return (
            <div className="grid grid-cols-1 gap-2 py-4" key={num}>
              <h4>Custom Field {num}</h4>
              <div className="grid grid-cols-1 gap-2">
                <form.Subscribe
                  selector={(state) => {
                    return {
                      errors: state.errors,
                      value: state.values[`customField${num}Enabled`],
                    };
                  }}
                >
                  {({ errors, value }) => {
                    return (
                      <form.Field name={`customField${num}Enabled`}>
                        {(field) => {
                          // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                          const errorMsg =
                            errors?.[0]?.[field.name]?.[0]?.message;

                          return (
                            <CheckboxField
                              checked={value}
                              error={errorMsg}
                              label="Enable"
                              name={field.name}
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
                      show: state.values[`customField${num}Enabled`],
                      value: state.values[`customField${num}Label`],
                    };
                  }}
                >
                  {({ errors, show, value }) => {
                    return (
                      show && (
                        <form.Field name={`customField${num}Label`}>
                          {(field) => {
                            // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                            const errorMsg =
                              errors?.[0]?.[field.name]?.[0]?.message;

                            return (
                              <InputField
                                className="pl-7"
                                error={errorMsg}
                                label="Label"
                                name={field.name}
                                onValueChange={field.handleChange}
                                required
                                value={value || ''}
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
                      errors: state.errors,
                      show: state.values[`customField${num}Enabled`],
                      value: state.values[`customField${num}Required`],
                    };
                  }}
                >
                  {({ errors, show, value }) => {
                    return (
                      show && (
                        <form.Field name={`customField${num}Required`}>
                          {(field) => {
                            // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                            const errorMsg =
                              errors?.[0]?.[field.name]?.[0]?.message;

                            return (
                              <CheckboxField
                                checked={value}
                                className="pl-7"
                                error={errorMsg}
                                label="Require"
                                name={field.name}
                                onCheckedChange={field.handleChange}
                              />
                            );
                          }}
                        </form.Field>
                      )
                    );
                  }}
                </form.Subscribe>
              </div>
            </div>
          );
        })}

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
