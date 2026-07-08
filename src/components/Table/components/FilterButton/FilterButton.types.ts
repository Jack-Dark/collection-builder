import type { JSXElementConstructor } from 'react';

export type FiltersButtonPropsDef = {
  FiltersContent: JSXElementConstructor<{}>;
  onReset: () => void | Promise<void>;
  onSubmit: () => Promise<void>;
};
