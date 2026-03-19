import { Link } from '@tanstack/react-router';
import { SignUpForm } from './components/SignUpForm';

export const SignUpPage = () => {
  return (
    <div className="grid grid-cols-1 gap-8">
      <h1>Sign Up!</h1>
      <SignUpForm />

      <p>
        Already have an account?{' '}
        <Link className="text-anchor" to={'/sign-in'}>
          Sign in!
        </Link>
      </p>
    </div>
  );
};
