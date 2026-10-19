import VerifiedIcon from '@mui/icons-material/Verified';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';

import { useRequestVerificationEmail } from '#/api/routes/users/request-verification-email/request-verification-email.react-query';
import { useUpdateEmail } from '#/api/routes/users/update-email/update-email.react-query';
import { useUpdateUser } from '#/api/routes/users/update-user/update-user.react-query';
import { updateUserSchema } from '#/api/routes/users/update-user/update-user.schema';
import { Button } from '#/components/Button';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { InputField } from '#/components/Fields/InputField';
import { FormSubmitButton } from '#/components/FormSubmitButton';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { PageWrapper } from '#/components/PageWrapper';
import { Popover } from '#/components/Popover';
import { useUserContext } from '#/hooks/use-user-context';
import { useValidationFormOptions } from '#/hooks/use-validation-form-options';
import { Route as CollectionRoute } from '#/routes/_protected/collections';

import { UpdatePasswordDialog } from './components/UpdatePasswordDialog';

export const AccountPage = () => {
  const router = useRouter();

  const user = useUserContext();
  const collectionPath = CollectionRoute.fullPath;

  const [showUpdatePasswordDialog, hideUpdatePasswordDialog] = useDialog(() => {
    return <UpdatePasswordDialog hideDialog={hideUpdatePasswordDialog} />;
  }, []);

  const { notify } = useNotifications();

  const { onRequestVerificationEmail } = useRequestVerificationEmail({
    onSuccess: ({ message }) => {
      notify(message);
    },
  });

  const { onUpdateEmail } = useUpdateEmail();

  const validationFormOptions = useValidationFormOptions({
    defaultValues: {
      email: user?.email || '',
      name: user?.name || '',
    },
    schema: updateUserSchema,
  });

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);

  const { onUpdateUser } = useUpdateUser();

  const form = useForm({
    ...validationFormOptions,
    onSubmit: async ({ value }) => {
      const isUpdatingEmail = value.email !== user?.email;
      if (isUpdatingEmail) {
        await onUpdateEmail({
          newEmail: value.email,
        });
        setIsEditingEmail(false);
        notify(`Verification email sent to ${value.email}`, { keepOpen: true });
      } else {
        await onUpdateUser(value);
        setIsEditingName(false);
      }

      router.invalidate();
    },
  });

  return user ? (
    <PageWrapper title="Account">
      <form className="flex">
        <div className="grid grid-cols-[1fr_max-content] gap-4 items-center">
          <form.Field name="name">
            {(field) => {
              return (
                <>
                  {isEditingName ? (
                    <InputField
                      name={field.name}
                      onValueChange={field.handleChange}
                      value={field.value}
                    />
                  ) : (
                    <p>{field.value}</p>
                  )}
                </>
              );
            }}
          </form.Field>

          {isEditingName ? (
            <div className="flex gap-2">
              <FormSubmitButton
                className="justify-self-start"
                form={form}
                size="sm"
                text="Save"
                type="submit"
              />
              <Button
                className="justify-self-start"
                onClick={() => {
                  setIsEditingName(false);
                }}
                size="sm"
                text="Cancel"
                variant="mono"
              />
            </div>
          ) : (
            <Button
              className="justify-self-start"
              disabled={isEditingEmail}
              onClick={() => {
                setIsEditingName(true);
              }}
              size="sm"
              text="Edit"
              variant="secondary"
            />
          )}

          <form.Field name="email">
            {(field) => {
              return (
                <>
                  {isEditingEmail ? (
                    <InputField
                      name={field.name}
                      onValueChange={field.handleChange}
                      type="email"
                      value={field.value}
                    />
                  ) : (
                    <div className="flex gap-2 items-center">
                      <p>
                        {
                          // ? Intentionally using user context instead of field value as user must verify the change via email before changes will take effect
                          user.email
                        }
                      </p>

                      {user.emailVerified && (
                        <Popover
                          Description="Email Verified"
                          Trigger={() => {
                            return (
                              <VerifiedIcon
                                className="text-primary-500"
                                fontSize="small"
                              />
                            );
                          }}
                        />
                      )}
                    </div>
                  )}
                </>
              );
            }}
          </form.Field>

          {isEditingEmail ? (
            <div className="flex gap-2">
              <FormSubmitButton
                className="justify-self-start"
                form={form}
                size="sm"
                text="Save"
                type="submit"
              />
              <Button
                className="justify-self-start"
                onClick={() => {
                  setIsEditingEmail(false);
                }}
                size="sm"
                text="Cancel"
                variant="mono"
              />
            </div>
          ) : (
            <Button
              className="justify-self-start"
              disabled={isEditingName}
              onClick={() => {
                setIsEditingEmail(true);
              }}
              size="sm"
              text="Edit"
              variant="secondary"
            />
          )}
        </div>
      </form>

      <div className="flex items-center gap-2 pt-10">
        {!user.emailVerified && (
          <Button
            className="justify-self-start"
            onClick={async () => {
              await onRequestVerificationEmail({
                callbackURL: collectionPath,
                email: user.email,
              });
            }}
            size="sm"
            text="Resend verification email"
            variant="secondary"
          />
        )}
      </div>

      <Button
        className="justify-self-start"
        onClick={showUpdatePasswordDialog}
        size="sm"
        text="Update Password"
      />

      <div className="pt-10">
        <Button
          className="justify-self-start"
          disabled
          onClick={() => {
            // TODO - REQUIRED FEATURE: ADD USER ACCOUNT DELETION SUPPORT
          }}
          size="sm"
          text="Delete account"
          variant="alert"
        />
      </div>
    </PageWrapper>
  ) : null;
};
