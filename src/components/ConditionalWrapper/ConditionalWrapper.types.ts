import type { PropsWithChildren, JSXElementConstructor } from 'react';

export type ConditionalWrapperPropsDef = PropsWithChildren<{
  condition: boolean;
  Wrapper: JSXElementConstructor<PropsWithChildren<Record<never, never>>>;
}>;
