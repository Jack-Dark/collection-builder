import type { ReactNode } from 'react';

import type { notificationTypes } from './Notifications.constants';

type NotifyOptions = {
  closeOthersOfType?: boolean;
  keepOpen?: boolean;
  /** Number of milliseconds to keep banner up. */
  time?: number;
  type?: NotificationType;
};

export type NotificationDetails = NotifyOptions & {
  id: string;
  message: ReactNode;
} & Required<Pick<NotifyOptions, 'type'>>;

export type NotificationType =
  (typeof notificationTypes)[keyof typeof notificationTypes];

export type Notify = (message: ReactNode, options?: NotifyOptions) => void;
