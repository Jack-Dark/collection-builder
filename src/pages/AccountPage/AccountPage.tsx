import VerifiedIcon from '@mui/icons-material/Verified';
import { authClient } from '#/auth/auth-client';
import { Button } from '#/components/Button';
import { PageWrapper } from '#/page-wrapper';

export const AccountPage = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // TODO - IMPLEMENT RESEND https://resend.com/docs/introduction

  return !user ? null : (
    <PageWrapper title="Account">
      <div className="grid grid-cols-2 gap-2 items-center">
        <div className="col-span-2">{user.image}</div>

        <p>{user.name}</p>
        <Button className="justify-self-start" disabled size="sm">
          Edit
        </Button>

        <p>
          {user.email}

          {user.emailVerified && <VerifiedIcon />}
        </p>
        <div className="flex items-center gap-2">
          <Button className="justify-self-start" disabled size="sm">
            Edit
          </Button>

          {!user.emailVerified && (
            <Button
              className="justify-self-start"
              disabled
              size="sm"
              variant="secondary"
            >
              Resend verification email
            </Button>
          )}
        </div>

        <div className="col-span-2">
          <Button className="justify-self-start" disabled size="sm">
            Update Password
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};
