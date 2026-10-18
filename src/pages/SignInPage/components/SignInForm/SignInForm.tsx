import { useForm } from '@tanstack/react-form';
import { useRouter, useSearch } from '@tanstack/react-router';

import type { RouterPath } from '#/types';

import { useInvalidateGetNavMenuCollections } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { authClient } from '#/auth/auth-client';
import { InputField } from '#/components/Fields/InputField';
import { FormSubmitButton } from '#/components/FormSubmitButton';
import { useNotifications } from '#/components/Notifications';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';

import { defaultValues, signInFormSchema } from './SignInForm.schema';

export const SignInForm = () => {
  const router = useRouter();
  const search: { redirect?: RouterPath } = useSearch({
    strict: false,
  });

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const validationFormOptions = useValidationFormOptions({
    defaultValues,
    schema: signInFormSchema,
  });

  const { notifyError } = useNotifications();

  const form = useForm({
    ...validationFormOptions,
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(value, {
        onError: (context) => {
          notifyError(context.error.message);
        },
        onSuccess: () => {
          invalidateGetNavMenuCollections();
          router.navigate({ to: search.redirect || '/collections' });
        },
      });
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
      <div className="grid gap-4 max-w-100">
        <form.Field name="email">
          {(field) => {
            return (
              <InputField
                error={field.errors}
                Label="Email"
                name={field.name}
                onValueChange={(value) => {
                  field.handleChange(value);
                }}
                required
                value={field.value}
              />
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            return (
              <InputField
                error={field.errors}
                Label="Password"
                name={field.name}
                onValueChange={(value) => {
                  field.handleChange(value);
                }}
                required
                type="password"
                value={field.value}
              />
            );
          }}
        </form.Field>

        <div className="flex gap-10 justify-between items-center pt-4">
          <FormSubmitButton form={form} text="Sign In" />
        </div>
      </div>
    </form>
  );
};
