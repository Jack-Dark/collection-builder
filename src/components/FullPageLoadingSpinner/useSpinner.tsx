import { useState } from 'react';

import { getCreateDefaultZustandState } from '#/helpers/get-create-default-zustand-state';

const createSpinnerStore = () => {
  const createNotificationsStore = getCreateDefaultZustandState<boolean>(false);

  return () => {
    const { setValue, value } = createNotificationsStore();

    return {
      hideSpinner: () => {
        return setValue(false);
      },
      isSpinnerShowing: value,
      showSpinner: () => {
        return setValue(true);
      },
      toggleSpinner: (show?: boolean) => {
        if (show) {
          setValue(false);
        } else
          setValue((prevValue) => {
            return !prevValue;
          });
      },
    };
  };
};

const useSpinnerStore = createSpinnerStore();

export const useSpinner = () => {
  const spinnerStore = useSpinnerStore();

  const { hideSpinner, showSpinner } = spinnerStore;

  const [processing, setProcessing] = useState<boolean>();

  /**
   * Handles showing/hiding the full-page loading indicator.
   *
   * Usage example:
   * ```
   * const { onInterceptRequest } = useSpinner();
   *
   * const handleEndpoint = async () => {
   *   await onInterceptRequest(async () => {
   *     try {
   *        await yourRequestedAxiosEndpoint();
   *      } catch (error: unknown) {
   *        notifyAxiosError({
   *         error,
   *         fallbackMessage: 'Unable to complete task.',
   *        });
   *      }
   *   })
   * };
   * ```
   */
  const onInterceptRequest = async (requestCallback: () => Promise<any>) => {
    try {
      showSpinner();

      return requestCallback();
    } finally {
      hideSpinner();
    }
  };

  /**
   * Handles toggling the processing state for use elsewhere.
   *
   * Usage example:
   * ```
   * const { onInterceptProcessingRequest, processing } = useSpinner();
   *
   * const handleEndpoint = async () => {
   *   await onInterceptProcessingRequest(async () => {
   *     try {
   *        await yourRequestedAxiosEndpoint();
   *      } catch (error: unknown) {
   *        notifyAxiosError({
   *         error,
   *         fallbackMessage: 'Unable to complete task.',
   *        });
   *      }
   *   })
   * };
   *
   * return <Button processing={processing} text="Confirm" />
   * ```
   */
  const onInterceptProcessingRequest = async (
    requestCallback: () => Promise<any>,
  ) => {
    try {
      setProcessing(true);

      return requestCallback();
    } finally {
      setProcessing(false);
    }
  };

  return {
    onInterceptProcessingRequest,
    onInterceptRequest,
    processing,
    setProcessing,
    ...spinnerStore,
  };
};
