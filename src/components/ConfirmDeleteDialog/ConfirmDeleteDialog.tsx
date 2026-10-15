import type { ConfirmDeleteDialogPropsDef } from './ConfirmDeleteDialog.types';

import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { useSpinner } from '../FullPageLoadingSpinner/useSpinner';

export const ConfirmDeleteDialog = (props: ConfirmDeleteDialogPropsDef) => {
  const {
    children = 'Are you sure you want to delete this?',
    hideDialog,
    onConfirm,
  } = props;

  const { onInterceptProcessingRequest, processing } = useSpinner();

  const handleConfirm = async () => {
    await onInterceptProcessingRequest(async () => {
      await onConfirm();
      hideDialog();
    });
  };

  return (
    <Dialog
      disableOnClose={processing}
      Footer={() => {
        return (
          <>
            <Button
              disabled={processing}
              onClick={hideDialog}
              text="Cancel"
              variant="mono"
            />
            <Button
              onClick={handleConfirm}
              processing={processing}
              text="Delete"
              variant="alert"
            />
          </>
        );
      }}
      Header="Confirm Delete"
      onClose={hideDialog}
    >
      {children}
    </Dialog>
  );
};
