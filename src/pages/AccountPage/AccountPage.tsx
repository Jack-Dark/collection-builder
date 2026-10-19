import VerifiedIcon from '@mui/icons-material/Verified';

import { useRequestVerificationEmail } from '#/api/routes/users/request-verification-email/request-verification-email.react-query';
import { Button } from '#/components/Button';
import { useDialog } from '#/components/Dialog/hooks/useDialog';
import { useNotifications } from '#/components/Notifications/useNotifications';
import { PageWrapper } from '#/components/PageWrapper';
import { Popover } from '#/components/Popover';
import { useUserContext } from '#/hooks/use-user-context';
import { Route as CollectionRoute } from '#/routes/_protected/collections';

import { UpdatePasswordDialog } from './components/UpdatePasswordDialog';

export const AccountPage = () => {
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

  return user ? (
    <PageWrapper title="Account">
      <div className="grid gap-10 items-center">
        <div className="flex gap-2 items-center">
          <p>{user.name}</p>
          <Button
            className="justify-self-start"
            disabled
            onClick={() => {
              // TODO - FEATURE: ADD USER NAME EDIT SUPPORT
            }}
            size="sm"
            text="Edit"
          />
        </div>

        <div className="flex gap-2 items-center">
          <p>
            {user.email}{' '}
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
          </p>

          <div className="flex items-center gap-2">
            <Button
              className="justify-self-start"
              disabled
              onClick={() => {
                // TODO - FEATURE: ADD USER EMAIL EDIT SUPPORT
              }}
              size="sm"
              text="Edit"
            />

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
              // TODO - FEATURE: ADD USER ACCOUNT DELETION SUPPORT
            }}
            size="sm"
            text="Delete account"
            variant="alert"
          />
        </div>
      </div>
    </PageWrapper>
  ) : null;
};
