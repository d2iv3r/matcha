"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface ChatContextType {
    totalUnreadMessages: number;
    fetchUnreadCount: () => Promise<void>;
    decrementUnreadCount: (amount?: number) => void;
    setTotalUnread: (count: number) => void;
    socket: Socket | null;
    onlineUsers: Record<number, { is_online: boolean; last_connection: string | null }>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<
        Record<number, { is_online: boolean; last_connection: string | null }>
    >({});

    const API_BASE_URL = "http://localhost:5001/api/v1";
    const SOCKET_URL = "http://localhost:5001";

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/unread-count`, {
                credentials: "include",
            });
            if (response.ok) {
                const result = await response.json();
                setTotalUnreadMessages(result.data.unread_count);
            }
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
        }
    }, []);

    const decrementUnreadCount = useCallback((amount: number = 1) => {
        setTotalUnreadMessages((prev) => Math.max(0, prev - amount));
    }, []);

    const setTotalUnread = useCallback((count: number) => {
        setTotalUnreadMessages(count);
    }, []);

    useEffect(() => {
        fetchUnreadCount();

        const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"],
            auth: { token }
        });

        newSocket.on("new_message", () => {
            fetchUnreadCount();
        });

        newSocket.on("messages_read", () => {
            fetchUnreadCount();
        });

        newSocket.on("user_status", (data: any) => {
            console.log("ChatProvider: User status update:", data);
            setOnlineUsers((prev) => ({
                ...prev,
                [Number(data.user_id)]: {
                    is_online: data.is_online,
                    last_connection: data.last_connection,
                },
            }));
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [fetchUnreadCount]);

    return (
        <ChatContext.Provider
            value={{
                totalUnreadMessages,
                fetchUnreadCount,
                decrementUnreadCount,
                setTotalUnread,
                socket,
                onlineUsers,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
