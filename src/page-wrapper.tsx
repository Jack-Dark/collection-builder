import type { PropsWithChildren } from 'react';

export const PageWrapper = (
  props: PropsWithChildren<{ childrenClassName?: string; title: string }>,
) => {
  const { children, childrenClassName = 'grid gap-8', title } = props;

  return (
    <div className="grid gap-4">
      <h1>{title}</h1>
      <section className={childrenClassName}>{children}</section>
    </div>
  );
};
