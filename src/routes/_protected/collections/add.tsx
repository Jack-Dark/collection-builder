import { createFileRoute } from '@tanstack/react-router';
import { AddCollectionPage } from '#/pages/AddCollectionPage';

export const Route = createFileRoute('/_protected/collections/add')({
  component: AddCollectionPage,
});
