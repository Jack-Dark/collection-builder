import { useForm, useSelector } from '@tanstack/react-form';

import { useUpdatePassword } from '#/api/routes/users/update-password/update-password.react-query';
import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { InputField } from '#/components/Fields/InputField';
import { FormSubmitButton } from '#/components/FormSubmitButton';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';

import type { UpdatePasswordDialogPropsDef } from './UpdatePasswordDialog.types';

import { updatePasswordFormSchema } from './UpdatePasswordDialog.schema';

export const UpdatePasswordDialog = (props: UpdatePasswordDialogPropsDef) => {
  const { hideDialog } = props;

  const validationFormOptions = useValidationFormOptions({
    defaultValues: {
      confirmNewPassword: '',
      currentPassword: '',
      newPassword: '',
    },
    schema: updatePasswordFormSchema,
  });

  const { notify } = useNotifications();

  const { onUpdatePassword } = useUpdatePassword({
    onSuccess: () => {
      notify('Your password has been updated');
    },
  });

  const form = useForm({
    ...validationFormOptions,
    formId: 'update-password',
    onSubmit: async ({ value }) => {
      await onUpdatePassword(value);
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
            <FormSubmitButton form={form} text="Update" />
          </>
        );
      }}
      Header="Update Password"
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
        <form.Field name="currentPassword">
          {(field) => {
            return (
              <InputField
                autoFocus
                error={field.errors}
                Label="Current Password"
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

        <form.Field name="newPassword">
          {(field) => {
            return (
              <InputField
                error={field.errors}
                Label="New Password"
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

        <form.Field name="confirmNewPassword">
          {(field) => {
            return (
              <InputField
                error={field.errors}
                Label="Confirm New Password"
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
      </form>
    </Dialog>
  );
};
