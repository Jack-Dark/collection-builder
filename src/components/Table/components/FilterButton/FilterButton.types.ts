import type { JSXElementConstructor } from 'react';

export type FiltersButtonPropsDef = {
  FiltersContent: JSXElementConstructor<{}>;
  numApplied: number;
  onCancel: () => void | Promise<void>;
  onReset: () => void | Promise<void>;
  onSubmit: () => void | Promise<void>;
};
