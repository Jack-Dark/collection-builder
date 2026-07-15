import { getCreateDefaultZustandStore } from '#/helpers/get-create-default-zustand-state';

import type { NotificationDetails } from './Notifications.types';

const createNotificationsStore = () => {
  const createNotificationsStore = getCreateDefaultZustandStore<
    NotificationDetails[]
  >([]);

  return () => {
    const { getValue, setValue, value } = createNotificationsStore();

    const clearNotification = (id: string) => {
      setValue((prevNotifications) => {
        return prevNotifications.filter((notification) => {
          return notification.id !== id;
        });
      });
    };

    return {
      clearNotification,
      getNotifications: getValue,
      notifications: value,
      setNotifications: setValue,
    };
  };
};

export const useNotificationsStore = createNotificationsStore();
