import { createFileRoute } from '@tanstack/react-router';
import { CollectionsPage } from '#/pages/CollectionsPage';

export const Route = createFileRoute('/_protected/collections/')({
  component: (props) => {
    return <CollectionsPage {...props} />;
  },
});
