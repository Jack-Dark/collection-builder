import { createFileRoute } from '@tanstack/react-router';

import { getAllCollectionsServerFn } from '#/api/routes/collections/server/serverFns';
import { CollectionsListPage } from '#/pages/CollectionsListPage';

export const Route = createFileRoute('/_protected/collections/')({
  component: (props) => {
    return <CollectionsListPage {...props} />;
  },
  loader: async () => {
    return getAllCollectionsServerFn();
  },
});
