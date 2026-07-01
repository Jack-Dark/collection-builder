import type { Dialog as MuiDialogType } from '@base-ui/react';
import type { DependencyList } from 'react';

import { Dialog as MuiDialog } from '@base-ui/react/dialog';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { DialogComponentDef } from '../Dialog.Context';

import { DialogContext } from '../Dialog.Context';

type ShowDialog = () => void;

type HideDialog = () => void;

type OnDialogOpenChange = (
  isOpen: boolean,
  eventDetails: MuiDialogType.Root.ChangeEventDetails,
) => void;

/**
 * @example
 *
 * const [openDialog, hideDialog] = useDialog(() => {
 *
 *   return (
 *     <Dialog {...yourDialogProps}
 *       Footer={() => {
 *         return (
 *           <Button onClick={hideDialog} text="Cancel" variant="secondary" />
 *         );
 *       }}>
 *       // Your dialog content
 *     </Dialog>
 *   );
 * }, []);
 *
 * return <Button onClick={openDialog} text="Open Dialog" />;
 */
export const useDialog = (
  DialogComponent: DialogComponentDef,
  dependencies: DependencyList = [],
): [ShowDialog, HideDialog] => {
  const [triggerId, setTriggerId] = useState<string | undefined>();

  const context = useContext(DialogContext);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const showDialog = useCallback(() => {
    const triggerId = uuidv4();

    setTriggerId(triggerId);
    setIsDialogOpen(true);
  }, []);

  const hideDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const Dialog = useMemo<DialogComponentDef>(() => {
    return () => {
      const onOpenChange: OnDialogOpenChange = (isOpen, eventDetails) => {
        const dialogId = eventDetails.trigger?.id;

        setIsDialogOpen(isOpen);
        setTriggerId(dialogId);
      };

      return (
        <MuiDialog.Root
          onOpenChange={onOpenChange}
          open={isDialogOpen}
          triggerId={triggerId}
        >
          <MuiDialog.Portal>
            <MuiDialog.Backdrop className="fixed inset-0 bg-black opacity-20 transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0 dark:opacity-50 supports-[-webkit-touch-callout:none]:absolute" />
            <DialogComponent />
          </MuiDialog.Portal>
        </MuiDialog.Root>
      );
    };
  }, [...dependencies, triggerId, isDialogOpen]);

  useEffect(() => {
    if (triggerId) {
      if (isDialogOpen) {
        context.showDialog(triggerId, Dialog);
      } else {
        context.hideDialog(triggerId);
      }
    }

    return () => {
      if (triggerId) {
        context.hideDialog(triggerId);
      }
    };
  }, [Dialog, isDialogOpen, triggerId]);

  return [showDialog, hideDialog];
};
