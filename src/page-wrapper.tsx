import type { PropsWithChildren } from 'react';

export const PageWrapper = (
  props: PropsWithChildren<{ childrenClassName?: string; title: string }>,
) => {
  const { children, childrenClassName = 'grid gap-8', title } = props;

  return (
    <div className="size-full grid gap-4 grid-rows-[auto_1fr]">
      <h1>{title}</h1>
      <section className={`size-full relative ${childrenClassName}`}>
        <div className="size-full absolute">{children}</div>
      </section>
    </div>
  );
};
