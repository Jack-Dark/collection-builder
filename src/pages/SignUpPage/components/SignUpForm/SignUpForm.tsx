import type { RouteComponent } from '@tanstack/react-router';

import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { authClient } from '#/auth/auth-client';
import { Button } from '#/components/Button';
import { InputField } from '#/components/InputField';

import { signUpFormSchema, defaultValues } from './schema';

export const SignUpForm: RouteComponent = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const { email, name, password } = value;
      const { data, error } = await authClient.signUp.email(
        {
          // image, // User image URL (optional)
          callbackURL: '/collection', // A URL to redirect to after the user verifies their email (optional)
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
            // redirect to the dashboard or sign in page
            // router.navigate('/collection')
          },
        },
      );

      console.log('🚀 ~ SignUpForm ~ error:', error);
      console.log('🚀 ~ SignUpForm ~ data:', data);

      router.invalidate();
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
            };
          }}
        >
          {({ errors }) => {
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
                      value={defaultValues[field.name]}
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
            };
          }}
        >
          {({ errors }) => {
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
                      value={defaultValues[field.name]}
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
            };
          }}
        >
          {({ errors }) => {
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
                      value={defaultValues[field.name]}
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
            };
          }}
        >
          {({ errors }) => {
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
                      value={defaultValues[field.name]}
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
              isFormValid: state.isFormValid,
              values: state.values,
            };
          }}
        >
          {(state) => {
            const { isFormValid, values } = state;
            console.clear();
            console.log('🚀 ~ SignUpForm ~ values:', values);

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
