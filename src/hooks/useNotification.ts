import { useState } from 'react';

type NotificationType = 'success' | 'error' | 'info';

type Notification = {
  id: string;
  message: string;
  type: NotificationType;
};

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType = 'success') => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return {
    notifications,
    showNotification,
    removeNotification
  };
};