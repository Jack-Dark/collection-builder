import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '#/layout';

import { Route as CollectionsRoute } from '../_protected/collections/add';
import { fetchAllCollections } from '../api/collections/route';

export const Route = createFileRoute('/_unprotected')({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/') {
      throw Route.redirect({
        to: CollectionsRoute.fullPath,
      });
    }
  },
  component: Layout,
  loader: async () => {
    const collections = await fetchAllCollections();

    return {
      collections,
    };
  },
});
