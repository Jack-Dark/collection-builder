import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type {
  NotificationDetails,
  NotificationType,
  Notify,
} from './Notifications.types';

import { Button } from '../Button';
import { SimpleErrorBoundary } from '../SimpleErrorBoundary';
import { notificationTypes } from './Notifications.constants';
import { useNotificationsStore } from './Notifications.store';

const notificationClasses = {
  error: {
    bg: 'bg-red-800',
    text: 'text-white',
  },
  success: {
    bg: 'bg-blue-800',
    text: 'text-white',
  },
  warning: {
    bg: 'bg-amber-400',
    text: 'text-black',
  },
} satisfies Record<NotificationType, Record<'bg' | 'text', string>>;

export const Notifications = () => {
  const { clearNotification, notifications } = useNotificationsStore();

  useEffect(() => {
    notifications.forEach((notification) => {
      const { id, keepOpen, message, time } = notification;

      if (!!message && !keepOpen) {
        setTimeout(() => {
          clearNotification(id);
        }, time);
      }
    });
  }, [notifications]);

  return (
    <div className="fixed t-0 grid w-full">
      {notifications.map((notification) => {
        const { id, keepOpen, message, type } = notification;

        return (
          <div
            className={`grid grid-cols-[1fr_auto] items-center gap-4 py-1 px-4 ${notificationClasses[type].bg}`}
            key={id}
          >
            <div className="justify-self-center overflow whitespace-nowrap text-ellipsis **:overflow **:whitespace-nowrap **:text-ellipsis">
              {typeof message === 'string' ? (
                <p className={notificationClasses[type].text}>{message}</p>
              ) : (
                <SimpleErrorBoundary
                  fallback={
                    <p className={notificationClasses[type].text}>
                      An unknown error occurred.
                    </p>
                  }
                >
                  {/* Error boundary intentionally doubled up to ensure it is caught appropriately */}
                  <SimpleErrorBoundary fallback={null}>
                    {message}
                  </SimpleErrorBoundary>
                </SimpleErrorBoundary>
              )}
            </div>
            {keepOpen && (
              <Button
                onClick={() => {
                  return clearNotification(notification.id);
                }}
                size="xs"
                variant="ghost"
              >
                <CloseIcon className={notificationClasses[type].text} />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const useNotifications = () => {
  const { setNotifications } = useNotificationsStore();

  const showNotification = (
    newNotification: Omit<NotificationDetails, 'id'>,
  ) => {
    const {
      closeOthersOfType,
      keepOpen = false,
      message = '',
      time = 2500,
      type = 'success',
    } = newNotification;

    if (message) {
      setNotifications((prevNotifications) => {
        const purifiedNotificationsList = prevNotifications.filter(
          (prevNotification) => {
            if (closeOthersOfType && type === prevNotification.type) {
              return false;
            }

            return true;
          },
        );

        const newNotification: NotificationDetails = {
          id: uuidv4(),
          keepOpen,
          message,
          time,
          type,
        };

        return [...purifiedNotificationsList, newNotification];
      });
    }
  };

  const notify: Notify = (message, options = {}) => {
    showNotification({
      closeOthersOfType: true,
      message,
      type: notificationTypes.success,
      ...options,
    });
  };

  const notifyWarning: Notify = (message, options = {}) => {
    showNotification({
      message,
      type: notificationTypes.warning,
      ...options,
    });
  };

  const notifyError: Notify = (message, options = {}) => {
    showNotification({
      message,
      type: notificationTypes.error,
      ...options,
    });
  };

  return { notify, notifyError, notifyWarning };
};
