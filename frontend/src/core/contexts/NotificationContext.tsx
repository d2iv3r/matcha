"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import {
    Notification,
    NotificationType,
    NotificationsResponse,
} from "@/core/types/notification";

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    hasMore: boolean;
    fetchNotifications: () => Promise<void>;
    fetchMore: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined,
);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotifications must be used within a NotificationProvider",
        );
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);

    const API_BASE_URL = "http://localhost:5001/api/v1";
    const SOCKET_URL = "http://localhost:5001";

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/?limit=20&offset=0`, {
                credentials: "include",
            });
            if (response.ok) {
                const result = await response.json();
                const data: NotificationsResponse = result.data;
                setNotifications(data.notifications);
                setUnreadCount(
                    data.notifications.filter((n) => !n.is_read).length,
                );
                setHasMore(data.notifications.length === 20);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchMore = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const offset = notifications.length;
            const response = await fetch(`${API_BASE_URL}/notifications/?limit=20&offset=${offset}`, {
                credentials: "include",
            });
            if (response.ok) {
                const result = await response.json();
                const data: NotificationsResponse = result.data;
                
                if (data.notifications.length === 0) {
                    setHasMore(false);
                } else {
                    setNotifications((prev) => [...prev, ...data.notifications]);
                    setHasMore(data.notifications.length === 20);
                }
            }
        } catch (error) {
            console.error("Failed to fetch more notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        // const token = localStorage.getItem("access_token");
        // if (!token) return;

        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        try {
            const response = await fetch(
                `${API_BASE_URL}/notifications/${id}/read`,
                {
                    method: "PATCH",
                    credentials: "include",
                },
            );
            if (!response.ok) {
                // Rollback on failure (optional, but good practice)
                // For simplicity we might just refetch if it fails significantly
                // fetchNotifications();
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        // Optimistic update
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);

        try {
            const response = await fetch(
                `${API_BASE_URL}/notifications/read-all`,
                {
                    method: "PATCH",
                    credentials: "include",
                },
            );
            if (!response.ok) {
                // fetchNotifications(); // Rollback if needed
            }
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => {
            // console.log("[Socket] Connected");
        });

        newSocket.on("notification", (notification: Notification) => {
            // console.log("[Socket] New notification:", notification);
            setNotifications((prev) => {
                if (prev.find((n) => n.id === notification.id)) return prev;
                return [notification, ...prev];
            });
            setUnreadCount((prev) => prev + 1);
        });

        newSocket.on("disconnect", () => {
            // console.log("[Socket] Disconnected");
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [fetchNotifications]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isLoading,
                hasMore,
                fetchNotifications,
                fetchMore,
                markAsRead,
                markAllAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
