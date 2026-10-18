import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useRouter, useSearch } from '@tanstack/react-router';

import type { RouterPath } from '#/types';

import { useInvalidateGetNavMenuCollections } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { authClient } from '#/auth/auth-client';
import { InputField } from '#/components/Fields/InputField';
import { FormSubmitButton } from '#/components/FormSubmitButton';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';

import { signUpFormSchema, defaultValues } from './SignUpForm.schema';

export const SignUpForm: RouteComponent = () => {
  const router = useRouter();

  const search: { redirect?: RouterPath } = useSearch({
    strict: false,
  });

  const validationFormOptions = useValidationFormOptions({
    defaultValues,
    schema: signUpFormSchema,
  });

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const form = useForm({
    ...validationFormOptions,
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(value, {
        onError: (context) => {
          alert(context.error.message);
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
        <form.Subscribe
          selector={(state) => {
            return {
              value: state.values.name,
            };
          }}
        >
          {({ value }) => {
            return (
              <form.Field name="name">
                {(field) => {
                  return (
                    <InputField
                      error={field.errors}
                      Label="Name"
                      name={field.name}
                      onValueChange={(value) => {
                        field.handleChange(value);
                      }}
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
              value: state.values.email,
            };
          }}
        >
          {({ value }) => {
            return (
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
                      value={value}
                      // valid={!!errorMsg}
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
              value: state.values.password,
            };
          }}
        >
          {({ value }) => {
            return (
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
              value: state.values.confirmPassword,
            };
          }}
        >
          {({ value }) => {
            return (
              <form.Field name="confirmPassword">
                {(field) => {
                  return (
                    <InputField
                      error={field.errors}
                      Label="Confirm password"
                      name={field.name}
                      onValueChange={(value) => {
                        field.handleChange(value);
                      }}
                      required
                      type="password"
                      value={value}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>

        <div className="flex">
          <FormSubmitButton form={form} text="Sign Up" />
        </div>
      </div>
    </form>
  );
};
