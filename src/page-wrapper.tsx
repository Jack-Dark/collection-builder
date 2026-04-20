import type { PropsWithChildren } from 'react';

export const PageWrapper = (props: PropsWithChildren<{ title: string }>) => {
  const { children, title } = props;

  return (
    <div className="grid grid-cols-1 gap-8">
      <h1>{title}</h1>
      <section>{children}</section>
    </div>
  );
};
