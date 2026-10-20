import { createFileRoute } from '@tanstack/react-router';

import { PageWrapper } from '#/components/PageWrapper';

import { createMetaTags } from '../__root';

export const Route = createFileRoute('/_unprotected/why-its-important')({
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
        title: "Why it's important to track your collections",
        description: "Learn why it's so important to track your collections.",
      }),
    };
  },
});
