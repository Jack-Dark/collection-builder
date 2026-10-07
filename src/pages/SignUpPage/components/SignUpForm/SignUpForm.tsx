import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useRouter, useSearch } from '@tanstack/react-router';

import type { RouterPath } from '#/types';

import { authClient } from '#/auth/auth-client';
import { Button } from '#/components/Button';
import { InputField } from '#/components/Fields/InputField';

import { signUpFormSchema, defaultValues } from './SignUpForm.schema';

export const SignUpForm: RouteComponent = () => {
  const router = useRouter();

  const search: { redirect?: RouterPath } = useSearch({
    strict: false,
  });

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const { email, name, password } = value;
      const { data, error } = await authClient.signUp.email(
        {
          email, // user email address
          name, // user display name
          password, // user password -> min 8 characters by default
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
        throw new Error(error.message);
      }
    },
    validators: [
      {
        run: signUpFormSchema,
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
                      label="Name"
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
                      label="Email"
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
                      label="Confirm password"
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
