import type { JSXElementConstructor, PropsWithChildren } from 'react';

import { Dialog as MuiDialog } from '@base-ui/react/dialog';
import CloseIcon from '@mui/icons-material/Close';

export type DialogPropsDef = PropsWithChildren<{
  Footer?: JSXElementConstructor<{}>;
  Header?: JSXElementConstructor<{}> | string;
  hideClose?: boolean;
  isFullScreen?: boolean;
}>;

export const Dialog = (props: DialogPropsDef) => {
  const { children, Footer, Header, hideClose = false, isFullScreen } = props;

  return (
    <MuiDialog.Viewport
      className={`fixed inset-0 flex md:items-center md:justify-center overflow-hidden ${isFullScreen ? '' : 'md:p-6'}`}
    >
      <MuiDialog.Popup
        className={`relative flex w-full h-full max-h-full max-w-full min-h-0 ${isFullScreen ? '' : `md:w-120 md:h-auto md:max-h-200`} flex-col bg-white duration-100 ease-out`}
      >
        <div
          className={`flex ${Header ? 'justify-between' : 'justify-end'} items-center gap-2 px-4 py-2 border-b border-gray-400`}
        >
          <CloseIcon className="opacity-0" />
          {Header &&
            (typeof Header === 'string' ? (
              <MuiDialog.Title>{Header}</MuiDialog.Title>
            ) : (
              <Header />
            ))}
          {!hideClose && (
            <MuiDialog.Close className="cursor-pointer">
              <CloseIcon />
            </MuiDialog.Close>
          )}
        </div>

        <div className="overflow-y-auto py-8 px-4">{children}</div>

        {Footer && (
          <div className="grid grid-flow-col gap-1 p-1 border-t border-gray-400">
            <Footer />
          </div>
        )}
      </MuiDialog.Popup>
    </MuiDialog.Viewport>
  );
};
