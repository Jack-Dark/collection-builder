import type { AnyReactFormApi } from '@tanstack/react-form';
import type { PropsWithChildren } from 'react';

export type ConfirmDeleteDialogPropsDef = PropsWithChildren<{
  hideDialog: () => void;
}> &
  (
    | {
        form?: never;
        onConfirm: () => Promise<void>;
      }
    | {
        form: AnyReactFormApi;
        onConfirm?: never;
      }
  );
