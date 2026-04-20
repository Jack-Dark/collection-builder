import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '#/layout';

export const Route = createFileRoute('/_unprotected')({
  component: Layout,
});
