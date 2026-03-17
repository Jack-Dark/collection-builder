import type { PropsWithChildren, JSXElementConstructor } from 'react';

export type ConditionalWrapperPropsDef = PropsWithChildren<{
  Wrapper: JSXElementConstructor<PropsWithChildren<Record<never, never>>>;
  condition: boolean;
}>;
