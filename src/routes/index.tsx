import { createFileRoute } from '@tanstack/react-router';
import { apiRoutes } from '#/api/routes';
import { Home } from '#/pages/Home';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    return apiRoutes.users.getAll();
  },
});
