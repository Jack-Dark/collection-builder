import type { PropsWithChildren } from 'react';

export const PageWrapper = (
  props: PropsWithChildren<{ childrenClassName?: string; title: string }>,
) => {
  const {
    children,
    childrenClassName = 'grid grid-cols-1 gap-8',
    title,
  } = props;

  return (
    <div className="grid grid-cols-1 gap-8">
      <h1>{title}</h1>
      <section className={childrenClassName}>{children}</section>
    </div>
  );
};
