import SaveIcon from '@mui/icons-material/Save';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { apiRoutes } from '#/api/routes';
import { Button } from '#/components/Button';
import { InputField } from '#/components/InputField';
import { useGetUserId } from '#/hooks/useGetUserId';
import { createNewCollection } from '#/routes/api/collections/route';
import { useRef } from 'react';

import { defaultValues } from './constants';

export const AddCollectionForm = () => {
  const router = useRouter();

  const { validateUserToCallback } = useGetUserId();

  const nameInput = useRef<HTMLInputElement>(null);

  const createCollection = useServerFn(createNewCollection);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      console.log('🚀 ~ AddCollectionForm ~ value:', value);
      await createCollection({
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
      onSubmit: apiRoutes.collections.createSchema,
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
