import type { PropsWithChildren } from 'react';

export type ConfirmDeleteDialogPropsDef = PropsWithChildren<{
  hideDialog: () => void;
  onConfirm: () => Promise<void>;
}>;
