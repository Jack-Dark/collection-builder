import type { RouteComponent } from '@tanstack/react-router';

import { Button, TextField, Typography, Stack } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { authClient } from '#/utils/auth-client';

import { signUpFormSchema, defaultValues } from './schema';

export const SignUpForm: RouteComponent = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: defaultValues,
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
          onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
          },
          onRequest: (ctx) => {
            // show loading
          },
          onSuccess: (ctx) => {
            // redirect to the dashboard or sign in page
            // router.navigate('/collection')
          },
        },
      );

      console.log('🚀 ~ AddGameForm ~ error:', error);
      console.log('🚀 ~ AddGameForm ~ data:', data);

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
      <Stack
        spacing={2}
        sx={{
          alignItems: 'flex-start',
        }}
      >
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
                    <TextField
                      defaultValue={defaultValues[field.name]}
                      error={!!errorMsg}
                      helperText={errorMsg}
                      label="Name"
                      name={field.name}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      required
                      sx={{ width: '100%' }}
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
                    <TextField
                      defaultValue={defaultValues[field.name]}
                      error={!!errorMsg}
                      helperText={errorMsg}
                      label="Email"
                      name={field.name}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      required
                      sx={{ width: '100%' }}
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
                    <TextField
                      defaultValue={defaultValues[field.name]}
                      error={!!errorMsg}
                      helperText={errorMsg}
                      label="Password"
                      name={field.name}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      required
                      sx={{ width: '100%' }}
                      type="password"
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
                    <TextField
                      defaultValue={defaultValues[field.name]}
                      error={!!errorMsg}
                      helperText={errorMsg}
                      label="Confirm password"
                      name={field.name}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      required
                      sx={{ width: '100%' }}
                      type="password"
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
            };
          }}
        >
          {(state) => {
            const { isFormValid } = state;

            return (
              <Button disabled={!isFormValid} type="submit">
                <Typography>Submit</Typography>
              </Button>
            );
          }}
        </form.Subscribe>
      </Stack>
    </form>
  );
};
