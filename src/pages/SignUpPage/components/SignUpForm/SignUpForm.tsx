import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useRouter, useSearch } from '@tanstack/react-router';
import { authClient } from '#/auth/auth-client';
import { Button } from '#/components/Button';
import { InputField } from '#/components/InputField';

import { signUpFormSchema, defaultValues } from './SignUpForm.schema';

export const SignUpForm: RouteComponent = () => {
  const router = useRouter();

  const search: { redirect?: string } = useSearch({
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
          onRequest: (context) => {
            // show loading
          },
          onSuccess: (context) => {
            router.navigate({ to: search.redirect || '/collection' });
          },
        },
      );

      if (data) {
        router.invalidate();
      } else {
        throw new Error(error.message);
      }
    },
    validators: {
      onSubmit: signUpFormSchema,
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
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <InputField
                      error={errorMsg}
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
              errors: state.errors,
              value: state.values.confirmPassword,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field name="confirmPassword">
                {(field) => {
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <InputField
                      error={errorMsg}
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
