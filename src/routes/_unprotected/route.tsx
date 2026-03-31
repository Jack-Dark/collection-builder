import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '#/layout';

export const Route = createFileRoute('/_unprotected')({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/') {
      throw Route.redirect({
        to: '/collection',
      });
    }
  },
  component: Layout,
});
