import { Link } from '@tanstack/react-router';

import { Button } from '#/components/Button';
import { PageWrapper } from '#/components/PageWrapper';

import { SignUpForm } from './components/SignUpForm';

export const SignUpPage = () => {
  return (
    <PageWrapper>
      <div className="grid gap-10">
        <h1>Sign Up</h1>

        <SignUpForm />

        <div className="flex gap-4 items-center text-sm">
          <p>Already have an account?</p>
          <Link to="/sign-in">
            <Button size="sm" variant="secondary">
              Sign in!
            </Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};
