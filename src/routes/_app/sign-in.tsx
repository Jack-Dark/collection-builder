import { createFileRoute } from '@tanstack/react-router';
import { SignInPage } from '#/pages/SignInPage';

export const Route = createFileRoute('/_app/sign-in')({
  component: SignInPage,
});
