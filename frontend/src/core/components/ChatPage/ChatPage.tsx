"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { format } from "date-fns";
import { useProfile } from "@/core/contexts/ProfileContext";
import { useChat } from "@/core/contexts/ChatContext";
import { Conversation, Message } from "@/core/types/chat";

import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { ReportModal } from "./ReportModal";

const API_BASE_URL = "http://localhost:5001/api/v1";
const SOCKET_URL = "http://localhost:5001";

export const ChatPage = () => {
    const { profile: myProfileData } = useProfile();
    const {
        fetchUnreadCount: refreshGlobalUnread,
        socket: globalSocket,
        onlineUsers,
        setTotalUnread,
    } = useChat();
    const myId = myProfileData?.profile?.user_id;
    const router = useRouter();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [messagesOffset, setMessagesOffset] = useState(0);
    const [loadingData, setLoadingData] = useState(false);

    const [showMenu, setShowMenu] = useState(false);
    const [block, setBlock] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReasons, setReportReasons] = useState<string[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [mobileView, setMobileView] = useState<"list" | "chat">("list");
    const [activeRecipientId, setActiveRecipientId] = useState<number | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState("");

    const menuRef = useRef<HTMLDivElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const formatUrl = useCallback((url: string | null) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        const finalPath = cleanPath.startsWith("/static")
            ? cleanPath
            : `/static${cleanPath}`;
        return `${SOCKET_URL}${finalPath}`;
    }, []);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, mobileView, scrollToBottom]);

    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/chat/conversations`, {
                credentials: "include",
            });
            if (res.ok) {
                const json = await res.json();
                console.log("Conversations data:", json.data);
                const convs = json.data || [];
                setConversations(convs);
                // Update navbar unread badge immediately from conversation data
                const total = convs.reduce(
                    (sum: number, c: Conversation) =>
                        sum + (c.unread_count ?? 0),
                    0,
                );
                setTotalUnread(total);
            }
        } catch (err) {
            console.error("Failed to fetch conversations:", err);
        }
    }, []);

    const fetchMatches = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/profile/matches`, {
                credentials: "include",
            });
            if (res.ok) {
                const json = await res.json();
                const mappedMatches = (json.data.matches || []).map(
                    (m: any) => ({
                        ...m,
                        user_id: m.liker_id,
                        username: m.liker_username,
                        avatar: m.liker_avatar,
                    }),
                );
                setMatches(mappedMatches);
            }
        } catch (err) {
            console.error("Failed to fetch matches:", err);
        }
    }, []);

    const fetchMessages = useCallback(
        async (conversationId: number, offset = 0) => {
            if (conversationId < 0) {
                setMessages([]);
                setHasMoreMessages(false);
                setMessagesOffset(0);
                return;
            }
            try {
                const limit = 100;
                const res = await fetch(
                    `${API_BASE_URL}/chat/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`,
                    { credentials: "include" },
                );
                if (res.ok) {
                    const json = await res.json();
                    const fetchedMessages = json.data || [];

                    if (offset === 0) {
                        setMessages(fetchedMessages.reverse());
                    } else {
                        // Prepend older messages, deduplicating by ID
                        setMessages((prev) => {
                            const existingIds = new Set(prev.map((m) => m.id));
                            const newMsgs = fetchedMessages
                                .reverse()
                                .filter((m: any) => !existingIds.has(m.id));
                            return [...newMsgs, ...prev];
                        });
                    }

                    setHasMoreMessages(fetchedMessages.length === limit);
                    setMessagesOffset(offset + fetchedMessages.length);
                }
            } catch (err) {
                console.error("Failed to fetch messages:", err);
            }
        },
        [],
    );

    const handleLoadMoreMessages = useCallback(() => {
        if (!selectedConversation || !hasMoreMessages) return;
        fetchMessages(selectedConversation.id, messagesOffset);
    }, [selectedConversation, hasMoreMessages, messagesOffset, fetchMessages]);

    const markAsRead = useCallback(
        async (conversationId: number) => {
            try {
                await fetch(`${API_BASE_URL}/chat/messages/read`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ conversation_id: conversationId }),
                    credentials: "include",
                });
                setConversations((prev) =>
                    prev.map((c,index) =>
                        c.id === conversationId ? { ...c, unread_count: 0 } : c,
                    ),
                );
                refreshGlobalUnread();
            } catch (err) {
                console.error("Failed to mark messages as read:", err);
            }
        },
        [refreshGlobalUnread],
    );

    const searchParams = useSearchParams();
    const targetUsername = searchParams.get("user");

    useEffect(() => {
        if (!myId) return;
        setLoadingData(true);
        Promise.all([fetchConversations(), fetchMatches()]).finally(() =>
            setLoadingData(false),
        );
    }, [myId, fetchConversations, fetchMatches]);

    useEffect(() => {
        if (!globalSocket) return;

        const onNewMessage = (payload: Message) => {
            setMessages((prev) => {
                if (payload.conversation_id === selectedConversation?.id) {
                    if (prev.find((m) => m.id === payload.id)) return prev;
                    markAsRead(payload.conversation_id);
                    return [...prev, payload];
                }
                return prev;
            });
            fetchConversations();
        };

        const onMessagesRead = (data: { conversation_id: number; reader_id: number }) => {
            if (data.conversation_id === selectedConversation?.id) {
                setMessages((prev) =>
                    prev.map((m,index) =>
                        m.sender_id === myId ? { ...m, is_read: true } : m,
                    ),
                );
            }
            fetchConversations();
        };

        globalSocket.on("new_message", onNewMessage);
        globalSocket.on("messages_read", onMessagesRead);

        return () => {
            globalSocket.off("new_message", onNewMessage);
            globalSocket.off("messages_read", onMessagesRead);
        };
    }, [
        globalSocket,
        selectedConversation?.id,
        fetchConversations,
        markAsRead,
        myId,
    ]);

    const handleSelectConversation = useCallback(
        (conv: Conversation) => {
            setSelectedConversation(conv);
            const otherId =
                Number(conv.user1_id) === Number(myId)
                    ? conv.user2_id
                    : conv.user1_id;
            const otherUsername =
                Number(conv.user1_id) === Number(myId)
                    ? conv.user2_username
                    : conv.user1_username;

            setActiveRecipientId(otherId);
            setMessagesOffset(0);
            setHasMoreMessages(true);
            fetchMessages(conv.id, 0);
            markAsRead(conv.id);
            setMobileView("chat");

            fetch(`${API_BASE_URL}/accounts/profile/${otherUsername}`, {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.success) {
                        setBlock(result.data.is_blocked || false);
                        // Update online status in the selected conversation
                        setSelectedConversation((prev) => {
                            if (!prev) return null;
                            const isUser1 =
                                Number(prev.user1_id) === Number(myId);
                            return {
                                ...prev,
                                [isUser1
                                    ? "user2_is_online"
                                    : "user1_is_online"]:
                                    result.data.profile.is_online,
                                [isUser1
                                    ? "user2_last_connection"
                                    : "user1_last_connection"]:
                                    result.data.profile.last_connection,
                            };
                        });
                    }
                })
                .catch((err) =>
                    console.error("Failed to fetch block status:", err),
                );
        },
        [fetchMessages, markAsRead, myId],
    );

    useEffect(() => {
        if (!myId) return;
        if (
            targetUsername &&
            (conversations.length > 0 || matches.length > 0)
        ) {
            const conv = conversations.find(
                (c) =>
                    c.user1_username === targetUsername ||
                    c.user2_username === targetUsername,
            );
            if (conv) {
                if (selectedConversation?.id !== conv.id) {
                    handleSelectConversation(conv);
                    setTimeout(() => inputRef.current?.focus(), 100);
                }
                return;
            }

            const match = matches.find((m) => m.username === targetUsername);
            if (match) {
                if (selectedConversation?.id === -match.user_id) return;
                setActiveRecipientId(match.user_id);
                const temp: Conversation = {
                    id: -match.user_id,
                    user1_id: myId || 0,
                    user2_id: match.user_id,
                    user1_username: myProfileData?.profile?.username || "Me",
                    user2_username: match.username,
                    user1_avatar: myProfileData?.profile?.avatar || null,
                    user2_avatar: match.avatar || null,
                    created_at: new Date().toISOString(),
                    last_message: null,
                    last_message_at: null,
                    unread_count: 0,
                };
                setSelectedConversation(temp);
                setMessages([]);
                setMobileView("chat");
                setTimeout(() => inputRef.current?.focus(), 100);
            }
        }
    }, [
        conversations,
        matches,
        targetUsername,
        handleSelectConversation,
        myId,
        myProfileData,
        selectedConversation,
    ]);

    const handleViewProfile = useCallback(() => {
        const otherUsername = selectedConversation
            ? Number(selectedConversation.user1_id) === Number(myId)
                ? selectedConversation.user2_username
                : selectedConversation.user1_username
            : "";
        if (otherUsername) {
            router.push(`/profile/${otherUsername}`);
        }
    }, [selectedConversation, myId, router]);

    const handleBlockUnblock = useCallback(async () => {
        const otherUsername = selectedConversation
            ? Number(selectedConversation.user1_id) === Number(myId)
                ? selectedConversation.user2_username
                : selectedConversation.user1_username
            : "";
        if (!otherUsername) return;

        const endpoint = block ? "unblock" : "block";
        try {
            const res = await fetch(
                `${API_BASE_URL}/profile/${otherUsername}/${endpoint}`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );
            if (res.ok) {
                setBlock(!block);
                setShowMenu(false);
            }
        } catch (err) {
            console.error(`Failed to ${endpoint} user:`, err);
        }
    }, [selectedConversation, myId, block]);

    const handleSendMessage = useCallback(async () => {
        if (block) return;
        let receiver_id = activeRecipientId;
        if (!receiver_id && selectedConversation && myId) {
            receiver_id =
                Number(selectedConversation.user1_id) === Number(myId)
                    ? selectedConversation.user2_id
                    : selectedConversation.user1_id;
        }

        if (
            !messageInput.trim() ||
            !selectedConversation ||
            !receiver_id ||
            !myId
        ) {
            return;
        }

        const tempMessage: Message = {
            id: Date.now(),
            conversation_id: selectedConversation.id,
            sender_id: myId,
            content: messageInput,
            is_read: false,
            created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempMessage]);
        const currentInput = messageInput;
        setMessageInput("");

        try {
            const res = await fetch(`${API_BASE_URL}/chat/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiver_id, content: currentInput }),
                credentials: "include",
            });

            if (res.ok) {
                const json = await res.json();
                const realMsg = json.data;

                setMessages((prev) => {
                    if (prev.some((m) => m.id === realMsg.id)) {
                        return prev.filter((m) => m.id !== tempMessage.id);
                    }
                    return prev.map((m,index) =>
                        m.id === tempMessage.id ? realMsg : m,
                    );
                });

                if (selectedConversation.id < 0 && realMsg.conversation_id) {
                    setSelectedConversation((prev) =>
                        prev ? { ...prev, id: realMsg.conversation_id } : null,
                    );
                }
            } else if (globalSocket) {
                globalSocket.emit("send_message", {
                    receiver_id,
                    content: currentInput,
                });
            }
            fetchConversations();
        } catch (err) {
            if (globalSocket)
                globalSocket.emit("send_message", {
                    receiver_id,
                    content: currentInput,
                });
            fetchConversations();
        }
    }, [
        block,
        activeRecipientId,
        selectedConversation,
        myId,
        messageInput,
        globalSocket,
        fetchConversations,
    ]);

    const formatMessageTime = useCallback((dateStr: string) => {
        try {
            return format(new Date(dateStr), "h:mm a");
        } catch (e) {
            return "";
        }
    }, []);

    const toggleReason = useCallback((reason: string) => {
        setReportReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason],
        );
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            )
                setShowMenu(false);
            if (
                emojiRef.current &&
                !emojiRef.current.contains(event.target as Node)
            )
                setShowEmojis(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="w-full h-full flex flex-row bg-[#F5F3FF] rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
                <ChatSidebar
                    conversations={conversations}
                    matches={matches}
                    selectedConversation={selectedConversation}
                    onSelectConversation={handleSelectConversation}
                    myId={myId}
                    myProfileData={myProfileData}
                    searchQuery={searchQuery}
                    onSearch={setSearchQuery}
                    formatUrl={formatUrl}
                    formatMessageTime={formatMessageTime}
                    mobileView={mobileView}
                />

                <div className="basis-px h-full w-px bg-gray-200 shrink-0 hidden lg:block" />

                <ChatWindow
                    selectedConversation={
                        selectedConversation
                            ? {
                                  ...selectedConversation,
                                  user1_is_online:
                                      onlineUsers[
                                          Number(selectedConversation.user1_id)
                                      ]?.is_online ??
                                      selectedConversation.user1_is_online,
                                  user2_is_online:
                                      onlineUsers[
                                          Number(selectedConversation.user2_id)
                                      ]?.is_online ??
                                      selectedConversation.user2_is_online,
                              }
                            : null
                    }
                    messages={messages}
                    myId={myId}
                    messageInput={messageInput}
                    onMessageInputChange={setMessageInput}
                    onSendMessage={handleSendMessage}
                    showEmojis={showEmojis}
                    setShowEmojis={setShowEmojis}
                    showMenu={showMenu}
                    setShowMenu={setShowMenu}
                    onViewProfile={handleViewProfile}
                    onBlockUnblock={handleBlockUnblock}
                    onOpenReport={() => {
                        setShowMenu(false);
                        setShowReportModal(true);
                    }}
                    block={block}
                    messagesEndRef={messagesEndRef}
                    inputRef={inputRef}
                    emojiRef={emojiRef}
                    menuRef={menuRef}
                    formatUrl={formatUrl}
                    formatMessageTime={formatMessageTime}
                    onBackToList={() => setMobileView("list")}
                    mobileView={mobileView}
                    hasMoreMessages={hasMoreMessages}
                    onLoadMore={handleLoadMoreMessages}
                />
            </div>

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                userFirstName={
                    selectedConversation
                        ? selectedConversation.user1_id === myId
                            ? selectedConversation.user2_username
                            : selectedConversation.user1_username
                        : ""
                }
                reportReasons={reportReasons}
                onToggleReason={toggleReason}
                onSendReport={() => {
                    console.log("Reporting user with reasons:", reportReasons);
                    setShowReportModal(false);
                }}
            />
        </div>
    );
};
