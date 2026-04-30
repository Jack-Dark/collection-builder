import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_unprotected/')({
  loader: () => {
    throw redirect({
      to: '/collections',
    });
  },
});
