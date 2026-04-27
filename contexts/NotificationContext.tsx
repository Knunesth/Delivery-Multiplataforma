import React, { createContext, useContext, useState } from 'react';

export type NotificationType = 'order' | 'eco' | 'promo' | 'system';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
  createdAt: number;
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextProps>({} as any);

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Nova Conquista Sustentável 🌿',
    message: 'Você acaba de economizar 500g de CO2 com seus últimos pedidos. Continue assim!',
    time: 'Ontem',
    type: 'eco',
    read: true,
    createdAt: Date.now() - 86400000,
  },
  {
    id: '2',
    title: 'Oferta: 20% OFF em Veganos',
    message: 'Aproveite nossa seleção de refeições veganas com desconto especial hoje.',
    time: 'Há 2 dias',
    type: 'promo',
    read: true,
    createdAt: Date.now() - 172800000,
  }
];

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notif: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substring(7),
      read: false,
      createdAt: Date.now(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
