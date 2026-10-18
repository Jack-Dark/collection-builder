import type { RouteComponent } from '@tanstack/react-router';

import { Link } from '@tanstack/react-router';

import { Button } from '#/components/Button';
import { PageWrapper } from '#/components/PageWrapper';

import { SignInForm } from './components/SignInForm';

export const SignInPage: RouteComponent = () => {
  return (
    <PageWrapper title="Sign In">
      <div className="grid gap-10">
        <SignInForm />

        <div className="flex gap-4 items-center text-sm">
          <p>Don't have an account yet?</p>
          <Link to="/sign-up">
            <Button size="sm" variant="secondary">
              Sign up!
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
