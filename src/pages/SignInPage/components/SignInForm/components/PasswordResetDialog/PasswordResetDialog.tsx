import { useForm, useSelector } from '@tanstack/react-form';

import { useRequestPasswordReset } from '#/api/routes/users/request-password-reset/request-password-reset.react-query';
import { requestPasswordResetSchema } from '#/api/routes/users/request-password-reset/request-password-reset.schema';
import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { InputField } from '#/components/Fields/InputField';
import { FormSubmitButton } from '#/components/FormSubmitButton';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';

import type { ResetPasswordDialogPropsDef } from './PasswordResetDialog.types';

export const ResetPasswordDialog = (props: ResetPasswordDialogPropsDef) => {
  const { defaultEmail = '', hideDialog } = props;

  const validationFormOptions = useValidationFormOptions({
    defaultValues: { email: defaultEmail },
    schema: requestPasswordResetSchema,
  });

  const { notify } = useNotifications();

  const { onRequestPasswordReset } = useRequestPasswordReset({
    onSuccess: ({ message }) => {
      notify(message, { time: 5000 });
    },
  });

  const form = useForm({
    ...validationFormOptions,
    onSubmit: async ({ value }) => {
      await onRequestPasswordReset(value);
      hideDialog();
    },
  });

  const isSubmitting = useSelector(form.atom, ({ isSubmitting }) => {
    return isSubmitting;
  });

  return (
    <Dialog
      disableOnClose={isSubmitting}
      Footer={() => {
        return (
          <>
            <Button onClick={hideDialog} text="Cancel" variant="mono" />
            <FormSubmitButton form={form} text="Reset" />
          </>
        );
      }}
      Header="Reset Password"
      onClose={hideDialog}
    >
      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => {
            return (
              <InputField
                autoFocus
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

        <p className="text-theme-t2">
          If an account exists in our system, you will be sent an email to reset
          your password.
        </p>
      </form>
    </Dialog>
  );
};
