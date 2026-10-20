import { useForm } from '@tanstack/react-form';

import type { HideDialog } from '#/components/Dialog/hooks/useDialog';

import { useDeleteUser } from '#/api/routes/users/delete-user/delete-user.react-query';
import { deleteUserSchema } from '#/api/routes/users/delete-user/delete-user.schema';
import { Button } from '#/components/Button';
import { ConfirmDeleteDialog } from '#/components/ConfirmDeleteDialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { InputField } from '#/components/Fields/InputField';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';

export const DeleteAccountButton = () => {
  const [showDeleteAccountDialog, hideDeleteAccountDialog] = useDialog(() => {
    return <DeleteAccountDialog hideDialog={hideDeleteAccountDialog} />;
  }, []);

  return (
    <Button
      className="justify-self-start"
      onClick={showDeleteAccountDialog}
      size="sm"
      text="Delete account"
      variant="alert"
    />
  );
};

const DeleteAccountDialog = (props: { hideDialog: HideDialog }) => {
  const { hideDialog } = props;

  const { notify } = useNotifications();

  const validationFormOptions = useValidationFormOptions({
    defaultValues: {
      password: '',
    },
    schema: deleteUserSchema,
  });

  const { onDeleteUser } = useDeleteUser({
    onSuccess: ({ message }) => {
      notify(message);
    },
  });

  const form = useForm({
    ...validationFormOptions,
    formId: 'delete-user',
    onSubmit: async ({ value }) => {
      onDeleteUser(value);
    },
  });

  return (
    <ConfirmDeleteDialog form={form} hideDialog={hideDialog}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid gap-10">
          <div className="grid gap-5">
            <p className="">
              This will{' '}
              <strong className="text-lg text-theme-t-alert">
                PERMANENTLY
              </strong>{' '}
              delete your account and all your collections!
            </p>

            <p>
              If you're sure you want to proceed, you must enter your password.
            </p>
          </div>

          <form.Field name="password">
            {(field) => {
              return (
                <InputField
                  error={field.errors}
                  Label="Password"
                  name={field.name}
                  onValueChange={field.handleChange}
                  required
                  type="password"
                  value={field.value}
                />
              );
            }}
          </form.Field>
        </div>
      </form>
    </ConfirmDeleteDialog>
  );
};
