import { createStore, useSelector } from '@tanstack/react-store';
import { useState } from 'react';

export const spinnerStore = createStore({ isSpinning: false });

export const useSpinner = () => {
  const { isSpinning } = useSelector(spinnerStore);

  const hideSpinner = () => {
    return spinnerStore.setState(() => {
      return { isSpinning: false };
    });
  };

  const showSpinner = () => {
    return spinnerStore.setState(() => {
      return { isSpinning: true };
    });
  };

  const toggleSpinner = (show?: boolean) => {
    if (show !== undefined) {
      spinnerStore.setState(() => {
        return { isSpinning: show };
      });
    } else
      spinnerStore.setState((prevValue) => {
        return { isSpinning: !prevValue };
      });
  };

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
    hideSpinner,
    isSpinning,
    onInterceptProcessingRequest,
    onInterceptRequest,
    processing,
    showSpinner,
    toggleSpinner,
  };
};
