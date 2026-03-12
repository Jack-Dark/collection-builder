import { createFileRoute } from '@tanstack/react-router';
import { apiRoutes } from '#/api/routes';
import { Collection } from '#/pages/collection';

export const Route = createFileRoute('/collection/')({
  component: Collection,
  loader: async () => {
    return apiRoutes.games.getAll();
  },
});
