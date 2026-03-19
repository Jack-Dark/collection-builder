import { Link, type RouteComponent } from '@tanstack/react-router';

import { SignInForm } from './components/SignInForm';

export const SignInPage: RouteComponent = () => {
  return (
    <div className="grid grid-cols-1 gap-8">
      <h1>Sign In</h1>
      <SignInForm />

      <p>
        Don't have an account yet?{' '}
        <Link className="text-anchor" to={'/sign-up'}>
          Sign up!
        </Link>
      </p>
    </div>
  );
  // TODO - ADD PASSWORD RESET
};
