import { createFileRoute } from '@tanstack/react-router';

import { getPaginatedCollectionsServerFn } from '#/api/routes/collections/get-paginated-collections/get-paginated-collections.serverFn';
import { CollectionsListPage } from '#/pages/CollectionsListPage';

export const Route = createFileRoute('/_protected/collections/')({
  component: (props) => {
    return <CollectionsListPage {...props} />;
  },
  loader: async () => {
    return getPaginatedCollectionsServerFn();
  },
});
