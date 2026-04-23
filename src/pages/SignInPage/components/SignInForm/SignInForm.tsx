import { useForm } from '@tanstack/react-form';
import { useRouter, useSearch } from '@tanstack/react-router';

import type { RouterPath } from '#/types';

import { authClient } from '#/auth/auth-client';
import { Button } from '#/components/Button';
import { InputField } from '#/components/InputField';

import { defaultValues, signInFormSchema } from './SignInForm.schema';

export const SignInForm = () => {
  const router = useRouter();
  const search: { redirect?: RouterPath } = useSearch({
    strict: false,
  });

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const { email, password } = value;
      const { data } = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onError: (context) => {
            // display the error message
            alert(context.error.message);
          },
          onRequest: () => {
            // show loading
          },
          onSuccess: () => {
            router.navigate({ to: search.redirect || '/' });
          },
        },
      );

      if (data) {
        router.invalidate();
      } else {
        // throw new Error(error.message);
      }
    },
    validators: {
      onSubmit: signInFormSchema,
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
              value: state.values.email,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field name="email">
                {(field) => {
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <InputField
                      error={errorMsg}
                      label="Email"
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
              errors: state.errors,
              value: state.values.password,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field name="password">
                {(field) => {
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <InputField
                      error={errorMsg}
                      label="Password"
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
              isFormValid: state.isFormValid,
              values: state.values,
            };
          }}
        >
          {(state) => {
            const { isFormValid } = state;

            return (
              <Button disabled={!isFormValid} type="submit">
                Submit
              </Button>
            );
          }}
        </form.Subscribe>
      </div>
    </form>
  );
};
