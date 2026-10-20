import { createFileRoute } from '@tanstack/react-router';

import { createMetaTags } from '../__root';
import { WhyItsImportantPage } from '../../pages/WhyItsImportantPage';

export const Route = createFileRoute('/_unprotected/why-its-important')({
  component: WhyItsImportantPage,
  head: () => {
    return {
      meta: createMetaTags({
        title: "Why it's important to track your collections",
        description: "Learn why it's so important to track your collections.",
      }),
    };
  },
});
