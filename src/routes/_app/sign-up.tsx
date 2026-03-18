import { createFileRoute } from '@tanstack/react-router';
import { SignUpPage } from '#/pages/SignUpPage';

export const Route = createFileRoute('/_app/sign-up')({
  component: SignUpPage,
});
