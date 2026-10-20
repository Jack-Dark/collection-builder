import { createFileRoute } from '@tanstack/react-router';

import { PageWrapper } from '#/components/PageWrapper';

import { createMetaTags } from '../__root';

export const Route = createFileRoute('/_unprotected/about')({
  component: () => {
    return (
      <PageWrapper title="About Collection Tracker">
        Content coming soon
      </PageWrapper>
    );
  },
  head: () => {
    return {
      meta: createMetaTags({
        title: 'About Collection Tracker',
        description: 'About the Collection Tracker project.',
      }),
    };
  },
});
