import { createFileRoute } from '@tanstack/react-router';
import { Home } from '#/pages/Home';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    // return apiRoutes.users.getAll();
  },
});
