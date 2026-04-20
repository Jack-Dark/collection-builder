import { createFileRoute } from '@tanstack/react-router';
import { AddCollectionPage } from '#/pages/AddCollectionPage';
import { fetchAllCollections } from '#/routes/api/collections/route';

export const Route = createFileRoute('/_protected/collections/add')({
  component: AddCollectionPage,
  loader: async () => {
    const collections = await fetchAllCollections();

    return {
      collections,
    };
  },
});
