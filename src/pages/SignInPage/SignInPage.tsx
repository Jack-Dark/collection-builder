import type { RouteComponent } from '@tanstack/react-router';

import { Link } from '@tanstack/react-router';
import { PageWrapper } from '#/page-wrapper';

import { SignInForm } from './components/SignInForm';

export const SignInPage: RouteComponent = () => {
  return (
    <PageWrapper title="Sign In">
      <SignInForm />

      <p>
        Don't have an account yet?{' '}
        <Link className="text-anchor" to="/sign-up">
          Sign up!
        </Link>
      </p>
    </PageWrapper>
  );
  // TODO - ADD PASSWORD RESET
};
