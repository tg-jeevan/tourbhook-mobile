import { useState, useEffect } from 'react';
import { NotificationItem } from '../types/notificationTypes';
import { getActiveNotifications } from './mockNotificationsData';

class NotificationStore {
  private notifications: NotificationItem[] = getActiveNotifications();
  private listeners: Set<() => void> = new Set();

  getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.notify();
  }

  markAsRead(id: string): void {
    let changed = false;
    this.notifications = this.notifications.map((n) => {
      if (n.id === id && !n.isRead) {
        changed = true;
        return { ...n, isRead: true };
      }
      return n;
    });
    if (changed) {
      this.notify();
    }
  }

  toggleReadStatus(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, isRead: !n.isRead } : n
    );
    this.notify();
  }

  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  addNotification(item: NotificationItem): void {
    this.notifications = [item, ...this.notifications];
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch {
        // Ignored
      }
    });
  }

  resetToInitial(): void {
    this.notifications = getActiveNotifications();
    this.notify();
  }
}

export const notificationStore = new NotificationStore();

export function useNotificationState() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    notificationStore.getNotifications()
  );
  const [unreadCount, setUnreadCount] = useState<number>(() =>
    notificationStore.getUnreadCount()
  );

  useEffect(() => {
    // Sync current values on mount
    setNotifications(notificationStore.getNotifications());
    setUnreadCount(notificationStore.getUnreadCount());

    const unsubscribe = notificationStore.subscribe(() => {
      setNotifications(notificationStore.getNotifications());
      setUnreadCount(notificationStore.getUnreadCount());
    });
    return unsubscribe;
  }, []);

  return {
    notifications,
    unreadCount,
    markAllAsRead: () => notificationStore.markAllAsRead(),
    markAsRead: (id: string) => notificationStore.markAsRead(id),
    toggleReadStatus: (id: string) => notificationStore.toggleReadStatus(id),
    deleteNotification: (id: string) => notificationStore.deleteNotification(id),
    addNotification: (item: NotificationItem) => notificationStore.addNotification(item),
  };
}
