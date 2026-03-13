import { createFileRoute } from '@tanstack/react-router';
import { Home } from '#/pages/Home';

export const Route = createFileRoute('/_app/sign-up')({
  component: Home,
  loader: async () => {
    // return apiRoutes.users.getAll();
  },
});
