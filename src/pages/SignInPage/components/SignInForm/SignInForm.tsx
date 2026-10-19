import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

import { useInvalidateGetNavMenuCollections } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { useSignIn } from '#/api/routes/users/sign-in/sign-in.react-query';
import { signInRequestSchema } from '#/api/routes/users/sign-in/sign-in.schema';
import { Button } from '#/components/Button';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { InputField } from '#/components/Fields/InputField';
import { FormSubmitButton } from '#/components/FormSubmitButton';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';
import { Route } from '#/routes/_unprotected/sign-in';

import { ResetPasswordDialog } from './components/PasswordResetDialog';

export const SignInForm = () => {
  const router = useRouter();
  const search = Route.useSearch();

  const invalidateGetNavMenuCollections = useInvalidateGetNavMenuCollections();

  const validationFormOptions = useValidationFormOptions({
    defaultValues: {
      email: '',
      password: '',
    },
    schema: signInRequestSchema,
  });

  const { onSignIn } = useSignIn({
    onSuccess: () => {
      invalidateGetNavMenuCollections();
      router.navigate({ to: search.redirect || '/collections' });
    },
  });

  const form = useForm({
    ...validationFormOptions,
    onSubmit: async ({ value }) => {
      await onSignIn(value);
    },
  });

  const [showResetPasswordDialog, hideResetPasswordDialog] = useDialog(() => {
    return (
      <form.Field name="email">
        {(field) => {
          return (
            <ResetPasswordDialog
              defaultEmail={field.value}
              hideDialog={hideResetPasswordDialog}
            />
          );
        }}
      </form.Field>
    );
  }, []);

  useLayoutEffect(() => {
    if (search.resetPassword) {
      showResetPasswordDialog();
    }
  }, [search.resetPassword]);

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

          <div className="flex items-center gap-1 text-sm">
            <p>Having trouble?</p>
            <Button onClick={showResetPasswordDialog} size="xs" variant="ghost">
              <span className="font-normal">Reset Password</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
