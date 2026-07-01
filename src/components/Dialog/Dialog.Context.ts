import type { FC } from 'react';

import { createContext } from 'react';

import type { DialogPropsDef } from '.';

export type DialogComponentDef = FC<DialogPropsDef>;

export interface DialogContextType {
  closeLast: () => void;
  hideDialog: (key: string) => void;
  showDialog: (key: string, component: DialogComponentDef) => void;
}

const invariantViolation = () => {
  throw new Error(
    'Attempted to call useDialog outside of dialog context. Make sure your app is rendered inside DialogProvider.',
  );
};

export const DialogContext = createContext<DialogContextType>({
  closeLast: invariantViolation,
  hideDialog: invariantViolation,
  showDialog: invariantViolation,
});
