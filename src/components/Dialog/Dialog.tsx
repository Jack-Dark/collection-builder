import type { JSXElementConstructor, PropsWithChildren } from 'react';

import { Dialog as MuiDialog } from '@base-ui/react/dialog';
import CloseIcon from '@mui/icons-material/Close';

export type DialogPropsDef = PropsWithChildren<
  {
    disableOnClose?: boolean;
    Footer?: JSXElementConstructor<{}>;
    Header?: JSXElementConstructor<{}> | string;
    isFullScreen?: boolean;
    maxWidthClassName?: string;
  } & (
    | {
        hideClose: boolean;
        onClose?: never;
      }
    | {
        hideClose?: never;
        onClose: () => void;
      }
  )
>;

export const Dialog = (props: DialogPropsDef) => {
  const {
    children,
    disableOnClose,
    Footer,
    Header,
    hideClose,
    isFullScreen,
    maxWidthClassName = 'md:max-w-100',
    onClose,
  } = props;

  return (
    <MuiDialog.Root disablePointerDismissal={hideClose} modal open>
      <MuiDialog.Viewport
        className={`fixed inset-0 flex md:items-center md:justify-center overflow-hidden ${isFullScreen ? '' : 'md:p-6'}`}
      >
        <MuiDialog.Popup
          className={`relative grid auto-rows-[max-content_1fr_max-content] w-full max-w-full h-full md:min-h-70 max-h-full ${isFullScreen ? '' : `md:w-full ${maxWidthClassName} md:h-auto md:max-h-[90dvh]`} flex-col bg-white duration-100 ease-out rounded-sm`}
        >
          {(Header || !hideClose) && (
            <div
              className={`flex ${Header && hideClose ? 'justify-center' : Header ? 'justify-between' : 'justify-end'} items-center gap-2 px-4 py-2 border-b border-gray-400`}
            >
              {!hideClose && <CloseIcon className="opacity-0" />}

              {Header &&
                (typeof Header === 'string' ? (
                  <MuiDialog.Title className="text-center">
                    {Header}
                  </MuiDialog.Title>
                ) : (
                  <Header />
                ))}

              {!hideClose && (
                <MuiDialog.Close
                  className="cursor-pointer"
                  disabled={disableOnClose}
                  onClick={onClose}
                >
                  <CloseIcon />
                </MuiDialog.Close>
              )}
            </div>
          )}

          <div className="overflow-y-auto py-4 px-4 md:content-center">
            {children}
          </div>

          {Footer && (
            <div className="grid grid-flow-col gap-1 p-1 border-t border-gray-400">
              <Footer />
            </div>
          )}
        </MuiDialog.Popup>
      </MuiDialog.Viewport>
    </MuiDialog.Root>
  );
};
