import { v4 as uuidv4 } from 'uuid';

import type { NotificationDetails, Notify } from './Notifications.types';

import { notificationTypes } from './Notifications.constants';
import { useNotificationsStore } from './Notifications.store';

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
