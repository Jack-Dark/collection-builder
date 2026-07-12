import CloseIcon from '@mui/icons-material/Close';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { LoadingSpinner } from './components/LoadingSpinner';
import { useSpinner } from './useSpinner';

export const FullPageLoadingSpinner = () => {
  const { hideSpinner, isSpinnerShowing } = useSpinner();

  const [showForceClose, setShowForceClose] = useState<boolean>(false);

  const debouncedShowForceClose = useRef(
    // ref required to correctly cancel debounce called via state changes https://stackoverflow.com/a/74738879
    debounce(() => {
      setShowForceClose(true);
    }, 5000),
  ).current;

  useEffect(() => {
    if (isSpinnerShowing && !showForceClose) {
      debouncedShowForceClose();
    } else if (!isSpinnerShowing) {
      if (showForceClose) {
        setShowForceClose(false);
      } else {
        debouncedShowForceClose.cancel();
      }
    }
  }, [isSpinnerShowing]);

  return isSpinnerShowing ? (
    <div
      className="fixed z-99999 size-full flex items-center justify-center bg-[rgba(0,0,0,0.2)]"
      data-loading-overlay=""
    >
      {showForceClose && (
        <button
          className="absolute top-10 right-10 p-1 bg-[rgba(0,0,0,0.2)] rounded-full cursor-pointer"
          onClick={() => {
            hideSpinner();
          }}
        >
          <CloseIcon className="text-white" fontSize="large" />
        </button>
      )}

      <LoadingSpinner
        border="border-2"
        enableShadow
        size="size-20"
        variant="color"
      />
    </div>
  ) : null;
};
