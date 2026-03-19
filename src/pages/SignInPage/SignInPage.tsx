import type { RouteComponent } from '@tanstack/react-router';

import { SignInForm } from './components/SignInForm';

export const SignInPage: RouteComponent = () => {
  return <SignInForm />;
  // TODO - ADD PASSWORD RESET
};
