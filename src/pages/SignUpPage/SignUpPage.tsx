import { Link } from '@tanstack/react-router';
import { PageWrapper } from '#/page-wrapper';

import { SignUpForm } from './components/SignUpForm';

export const SignUpPage = () => {
  return (
    <PageWrapper title="Sign Up!">
      <SignUpForm />

      <p>
        Already have an account?{' '}
        <Link className="text-anchor" to="/sign-in">
          Sign in!
        </Link>
      </p>
    </PageWrapper>
  );
};
