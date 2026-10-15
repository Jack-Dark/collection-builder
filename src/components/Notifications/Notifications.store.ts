import { createAtom, useAtom } from '@tanstack/react-store';

import type { NotificationDetails } from './Notifications.types';

const notificationsAtom = createAtom<NotificationDetails[]>([]);

export const useNotificationsStore = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const clearNotification = (id: string) => {
    setNotifications((prevNotifications) => {
      return prevNotifications.filter((notification) => {
        return notification.id !== id;
      });
    });
  };

  return {
    clearNotification,
    notifications,
    setNotifications,
  };
};
