"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface ChatContextType {
    totalUnreadMessages: number;
    fetchUnreadCount: () => Promise<void>;
    decrementUnreadCount: (amount?: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
    const [socket, setSocket] = useState<Socket | null>(null);

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

    useEffect(() => {
        fetchUnreadCount();

        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"],
        });

        newSocket.on("new_message", () => {
            // Simply refetch the total count or increment
            // Refetching is safer to ensure sync with other tabs/actions
            fetchUnreadCount();
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [fetchUnreadCount]);

    return (
        <ChatContext.Provider value={{ totalUnreadMessages, fetchUnreadCount, decrementUnreadCount }}>
            {children}
        </ChatContext.Provider>
    );
};
