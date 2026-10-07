import { useForm } from '@tanstack/react-form';
import { useRouter, useSearch } from '@tanstack/react-router';

import type { RouterPath } from '#/types';

import { authClient } from '#/auth/auth-client';
import { Button } from '#/components/Button';
import { InputField } from '#/components/Fields/InputField';

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
        // invalidate
      } else {
        // throw new Error(error.message);
      }
    },
    validators: [
      {
        run: signInFormSchema,
        triggers: ['change'],
      },
    ],
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
              errors: state.errors,
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
              isValid: state.isValid,
              values: state.values,
            };
          }}
        >
          {(state) => {
            const { isValid } = state;

            return (
              <div className="justify-start">
                <Button disabled={!isValid} text="Submit" type="submit" />
              </div>
            );
          }}
        </form.Subscribe>
      </div>
    </form>
  );
};
