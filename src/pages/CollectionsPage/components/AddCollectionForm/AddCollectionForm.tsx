import SaveIcon from '@mui/icons-material/Save';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useCreateCollection } from '#/api/routes/collections/client/hooks';
import { createCollectionSchema } from '#/api/routes/collections/server/serverFns';
import { Button } from '#/components/Button';
import { InputField } from '#/components/InputField';
import { useRef } from 'react';

import { defaultValues } from './constants';

export const AddCollectionForm = () => {
  const router = useRouter();

  const nameInput = useRef<HTMLInputElement>(null);

  const { onCreateCollection } = useCreateCollection();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onCreateCollection({
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
