import type { FC } from 'react';

import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import type { DialogComponentDef } from './Dialog.Context';

import { DialogContext } from './Dialog.Context';
import { DialogRoot } from './Dialog.Root';

export type DialogProviderPropsDef = React.PropsWithChildren<{}>;

export const DialogProvider: FC<DialogProviderPropsDef> = ({ children }) => {
  const [dialogs, setDialogs] = useState<Record<string, DialogComponentDef>>(
    {},
  );

  const showDialog = useCallback(
    (key: string, Component: DialogComponentDef) => {
      return setDialogs((dialogs) => {
        return {
          ...dialogs,
          [key]: Component,
        };
      });
    },
    [],
  );

  const hideDialog = useCallback((key: string) => {
    return setDialogs((dialogs: Record<string, DialogComponentDef>) => {
      if (!dialogs[key]) {
        return dialogs;
      }

      const newDialogs = { ...dialogs };

      delete newDialogs[key];

      return newDialogs;
    });
  }, []);

  const closeLast = useCallback(() => {
    setDialogs((dialogs: Record<string, DialogComponentDef>) => {
      const lastKey = Object.keys(dialogs).pop();

      if (!lastKey) {
        return dialogs;
      }

      const newDialogs = { ...dialogs };

      delete newDialogs[lastKey];

      return newDialogs;
    });
  }, []);

  const contextValue = useMemo(() => {
    return { closeLast, hideDialog, showDialog };
  }, []);

  return (
    <DialogContext.Provider value={contextValue}>
      <>
        {children}
        <DialogRoot dialogs={dialogs} />
      </>
    </DialogContext.Provider>
  );
};
