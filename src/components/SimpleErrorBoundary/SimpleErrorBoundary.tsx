import type { PropsWithChildren } from 'react';
import type { ErrorBoundaryPropsWithFallback } from 'react-error-boundary';

import { ErrorBoundary } from 'react-error-boundary';

export const SimpleErrorBoundary = ({
  children,
  ...rest
}: PropsWithChildren<Partial<ErrorBoundaryPropsWithFallback>>) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4">
          <p>There was an error rendering this content.</p>
          <p>
            <a
              href="https://github.com/Jack-Dark/collection-builder/issues"
              target="_blank"
            >
              Please report this bug.
            </a>
          </p>
        </div>
      }
      {...rest}
    >
      {children}
    </ErrorBoundary>
  );
};
