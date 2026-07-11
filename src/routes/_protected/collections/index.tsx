import { createFileRoute } from '@tanstack/react-router';

import { getAllCollectionsServerFn } from '#/api/routes/collections/server/get-all-collections/get-all-collections.serverFn';
import { CollectionsListPage } from '#/pages/CollectionsListPage';

export const Route = createFileRoute('/_protected/collections/')({
  component: (props) => {
    return <CollectionsListPage {...props} />;
  },
  loader: async () => {
    return getAllCollectionsServerFn();
  },
});
