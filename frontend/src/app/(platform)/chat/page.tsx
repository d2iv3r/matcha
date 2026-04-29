"use client";

import {
    Search,
    MoreVertical,
    Shield,
    ShieldBan,
    Eye,
    Flag,
    X,
    Smile,
    Send,
    ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import girl from "@/public/girl1.png";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { format } from "date-fns";
import { useProfile } from "@/core/contexts/ProfileContext";
import { useChat } from "@/core/contexts/ChatContext";
import { Conversation, Message } from "@/core/types/chat";

const EMOJIS = [
    "😀",
    "😂",
    "🥰",
    "😎",
    "🥺",
    "😭",
    "😤",
    "😡",
    "👍",
    "🙏",
    "🔥",
    "✨",
    "❤️",
    "💯",
    "🎉",
    "👀",
    "🤔",
    "🙄",
    "🤫",
    "😘",
    "😜",
    "🤭",
    "🤤",
    "🥱",
];

export default function ChatPage() {
    const { profile: myProfileData } = useProfile();
    const { fetchUnreadCount: refreshGlobalUnread } = useChat();
    const myId = myProfileData?.profile?.user_id;

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
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

    const API_BASE_URL = "http://localhost:5001/api/v1";
    const SOCKET_URL = "http://localhost:5001";

    const formatUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;

        // Ensure the URL starts with /static/
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        const finalPath = cleanPath.startsWith("/static")
            ? cleanPath
            : `/static${cleanPath}`;

        return `${SOCKET_URL}${finalPath}`;
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, mobileView]);

    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/chat/conversations`, {
                credentials: "include",
            });
            if (res.ok) {
                const json = await res.json();
                setConversations(json.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch conversations:", err);
        }
    }, [API_BASE_URL]);

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
    }, [API_BASE_URL]);

    const fetchMessages = useCallback(async (conversationId: number) => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
                { credentials: "include" },
            );
            if (res.ok) {
                const json = await res.json();
                // Backend returns DESC (newest first) for pagination, but UI needs ASC (oldest first)
                setMessages((json.data || []).reverse());
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (conversationId: number) => {
        try {
            await fetch(`${API_BASE_URL}/chat/messages/read`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversation_id: conversationId }),
                credentials: "include",
            });
            setConversations((prev) =>
                prev.map((c) =>
                    c.id === conversationId ? { ...c, unread_count: 0 } : c,
                ),
            );
            // Refresh the global count in the navbar
            refreshGlobalUnread();
        } catch (err) {
            console.error("Failed to mark messages as read:", err);
        }
    }, []);

    const searchParams = useSearchParams();
    const targetUsername = searchParams.get("user");

    useEffect(() => {
        if (!myId) return;
        setLoadingData(true);
        Promise.all([fetchConversations(), fetchMatches()]).finally(() =>
            setLoadingData(false),
        );

        const token = localStorage.getItem("access_token");
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ["polling", "websocket"],
            auth: { token },
        });

        newSocket.on("new_message", (payload: Message) => {
            setMessages((prev) => {
                if (payload.conversation_id === selectedConversation?.id) {
                    if (prev.find((m) => m.id === payload.id)) return prev;
                    // If we are currently viewing this conversation, mark it as read immediately
                    markAsRead(payload.conversation_id);
                    return [...prev, payload];
                }
                return prev;
            });
            fetchConversations();
        });

        setSocket(newSocket);
        return () => {
            newSocket.close();
        };
    }, [myId, selectedConversation?.id, fetchConversations, fetchMatches]);

    const handleSelectConversation = useCallback(
        (conv: Conversation) => {
            setSelectedConversation(conv);
            const otherId =
                Number(conv.user1_id) === Number(myId)
                    ? conv.user2_id
                    : conv.user1_id;
            setActiveRecipientId(otherId);
            fetchMessages(conv.id);
            markAsRead(conv.id);
            setMobileView("chat");
        },
        [fetchMessages, markAsRead, myId],
    );

    useEffect(() => {
        if (!myId) return; // Wait for profile to load
        if (
            targetUsername &&
            (conversations.length > 0 || matches.length > 0)
        ) {
            // 1. Try to find an existing conversation
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

            // 2. If no conversation, try to find a match
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

    const handleSendMessage = async () => {
        // Fallback: If activeRecipientId is missing, calculate it from the conversation
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
            // console.error(`!!! MESSAGE BLOCKED !!!
            //     input="${messageInput}"
            //     hasConv=${!!selectedConversation}
            //     recID=${receiver_id}
            //     myID=${myId}
            //     myProf=${!!myProfileData}
            //     u1=${selectedConversation?.user1_id}
            //     u2=${selectedConversation?.user2_id}`);
            return;
        }

        // console.log("!!! SENDING MESSAGE !!!");
        // console.log("-> to receiver:", receiver_id);

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

                // Deduplicate: If socket already added this real message, just remove the temp message.
                // Otherwise, replace the temp message with the real message.
                setMessages((prev) => {
                    if (prev.some((m) => m.id === realMsg.id)) {
                        return prev.filter((m) => m.id !== tempMessage.id);
                    }
                    return prev.map((m) =>
                        m.id === tempMessage.id ? realMsg : m,
                    );
                });

                // If it was a new conversation (negative ID), update it with the real ID
                if (selectedConversation.id < 0 && realMsg.conversation_id) {
                    setSelectedConversation((prev) =>
                        prev ? { ...prev, id: realMsg.conversation_id } : null,
                    );
                }
            } else if (socket) {
                socket.emit("send_message", {
                    receiver_id,
                    content: currentInput,
                });
            }
            fetchConversations();
        } catch (err) {
            if (socket)
                socket.emit("send_message", {
                    receiver_id,
                    content: currentInput,
                });
            fetchConversations();
        }
    };

    const formatMessageTime = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "h:mm a");
        } catch (e) {
            return "";
        }
    };

    const toggleReason = (reason: string) => {
        setReportReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason],
        );
    };

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
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="w-full h-full flex flex-row bg-[#F5F3FF] rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
                {/* Left panel: chat list — hidden on mobile when in chat view */}
                <div
                    className={`flex flex-col gap-3 p-5 w-full lg:w-[25%] shrink-0 ${
                        mobileView === "chat" ? "hidden" : "flex"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold">Messages</h1>
                        {conversations.reduce((acc, c) => acc + (c.unread_count ?? 0), 0) > 0 && (
                            <span className="bg-[#6367FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {conversations.reduce((acc, c) => acc + (c.unread_count ?? 0), 0)} new
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2 bg-[#E9E8FF] p-1 text-xs rounded-lg items-center text-[#6367FF] mb-2">
                        <Search size={20} />
                        <input
                            type="search"
                            placeholder="Search..."
                            onChange={handleSearch}
                            className="w-full bg-[#E9E8FF] outline-none text-[#6367FF]"
                        />
                    </div>
                    <hr className="border-[#C6BAFF] py-1" />
                    <div className="flex-1 overflow-y-auto pr-2">
                        <div className="flex flex-col gap-3 w-full">
                            {matches.filter(m => 
                                m.username.toLowerCase().includes(searchQuery.toLowerCase())
                            ).length === 0 ? (
                                <p className="text-center text-[10px] text-gray-500 py-10">
                                    {searchQuery ? "No matches found" : "No matches yet"}
                                </p>
                            ) : (
                                matches
                                    .filter(m => 
                                        m.username.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((match) => {
                                    const conv = conversations.find(
                                        (c) =>
                                            c.user1_id === match.user_id ||
                                            c.user2_id === match.user_id,
                                    );
                                    const isSelected =
                                        selectedConversation?.user2_id ===
                                            match.user_id ||
                                        selectedConversation?.user1_id ===
                                            match.user_id;
                                    return (
                                        <div
                                            key={match.user_id}
                                            className="w-full flex flex-row gap-2 items-center cursor-pointer p-1"
                                            onClick={() => {
                                                if (conv)
                                                    handleSelectConversation(
                                                        conv,
                                                    );
                                                else {
                                                    setActiveRecipientId(
                                                        match.user_id,
                                                    );
                                                    const temp: Conversation = {
                                                        id: -match.user_id,
                                                        user1_id: myId || 0,
                                                        user2_id: match.user_id,
                                                        user1_username:
                                                            myProfileData
                                                                ?.profile
                                                                ?.username ||
                                                            "",
                                                        user2_username:
                                                            match.username,
                                                        user1_avatar:
                                                            myProfileData
                                                                ?.profile
                                                                ?.avatar ||
                                                            null,
                                                        user2_avatar:
                                                            match.avatar,
                                                        created_at:
                                                            new Date().toISOString(),
                                                        last_message: null,
                                                        last_message_at: null,
                                                    };
                                                    setSelectedConversation(
                                                        temp,
                                                    );
                                                    setMessages([]);
                                                    setMobileView("chat");
                                                }
                                            }}
                                        >
                                            <div className="relative">
                                                <Image
                                                    src={
                                                        formatUrl(
                                                            match.avatar,
                                                        ) || girl
                                                    }
                                                    alt="Profile"
                                                    width={50}
                                                    height={50}
                                                    className="aspect-square object-cover rounded-full"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 flex-1 min-w-0 justify-between">
                                                <h3 className="text-xs font-bold truncate">
                                                    {match.username}
                                                </h3>
                                                <p className="text-[10px] text-gray-500 truncate max-w-[100px]">
                                                    {conv?.last_message ||
                                                        "New Match ✨"}
                                                </p>
                                            </div>
                                            <div className="flex flex-col h-full gap-1 justify-between items-end">
                                                <p className="text-[10px] text-gray-500">
                                                    {conv?.last_message_at
                                                        ? formatMessageTime(
                                                              conv.last_message_at,
                                                          )
                                                        : ""}
                                                </p>
                                                <div className="flex flex-col gap-1 h-5">
                                                    {conv?.unread_count ? (
                                                        <div className="flex flex-col gap-1 bg-[#6367FF] w-4 h-4 rounded-full justify-center items-center">
                                                            <p className="text-[10px] text-white">
                                                                {conv.unread_count >
                                                                9
                                                                    ? "+9"
                                                                    : conv.unread_count}
                                                            </p>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
                <div className="basis-px h-full w-px bg-gray-200 shrink-0 hidden lg:block" />

                {/* Right panel: Chat */}
                <div
                    className={`flex-1 flex flex-col  min-h-0 bg-[#F9F8FF] ${mobileView === "chat" ? "flex" : "hidden lg:flex"}`}
                >
                    {selectedConversation ? (
                        <>
                            {/* Header */}
                            <div className="relative flex flex-row gap-2 items-center p-5 justify-between bg-white">
                                <div className="flex gap-4 items-center">
                                    <button
                                        onClick={() => setMobileView("list")}
                                        className="p-2 text-[#6367FF] hover:bg-[#E2DCFF] rounded-xl transition-colors cursor-pointer"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="relative">
                                        <Image
                                            src={
                                                formatUrl(
                                                    selectedConversation.user1_id ===
                                                        myId
                                                        ? selectedConversation.user2_avatar
                                                        : selectedConversation.user1_avatar,
                                                ) || girl
                                            }
                                            alt="Profile"
                                            width={50}
                                            height={50}
                                            className="aspect-square rounded-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <h2 className="font-bold text-gray-900">
                                        {selectedConversation.user1_id === myId
                                            ? selectedConversation.user2_username
                                            : selectedConversation.user1_username}
                                    </h2>
                                </div>

                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-2 text-gray-500 hover:bg-[#E2DCFF] hover:text-[#6367FF] rounded-xl transition-colors cursor-pointer"
                                    >
                                        <MoreVertical size={24} />
                                    </button>
                                    {showMenu && (
                                        <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-20 flex flex-col w-44 border border-gray-100">
                                            <button className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-xs font-medium">
                                                <Eye size={14} />
                                                <span>View Profile</span>
                                            </button>
                                            <button
                                                onClick={() => setBlock(!block)}
                                                className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 border-t border-gray-50 text-xs font-medium"
                                            >
                                                <Shield size={14} />
                                                <span>
                                                    {block
                                                        ? "Unblock"
                                                        : "Block User"}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    setShowReportModal(true);
                                                }}
                                                className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 border-t border-gray-50 text-xs font-medium"
                                            >
                                                <Flag size={14} />
                                                <span>Report User</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-[#E9E8FF] h-px " />
                            {/* Messages */}
                            <div className="flex-2 overflow-y-auto px-5 py-2 flex flex-col gap-4 min-h-0">
                                {messages.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                                        <p className="text-xs font-medium">
                                            No messages yet
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMine = msg.sender_id === myId;
                                        return (
                                            <div
                                                key={msg.id || idx}
                                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] px-4 py-3 rounded-2xl relative ${
                                                        isMine
                                                            ? "bg-[#6367FF] text-white rounded-br-none"
                                                            : "bg-[#E9E8FF] text-gray-800 rounded-tl-none"
                                                    }`}
                                                >
                                                    <p className="break-words text-[13px] max-w-[300px] mb-1 pr-10">
                                                        {msg.content}
                                                    </p>
                                                    <div
                                                        className={`flex items-center justify-end gap-1 mt-1 ${
                                                            isMine
                                                                ? "text-white/70"
                                                                : "text-gray-800"
                                                        }`}
                                                    >
                                                        <span className="text-[9px]">
                                                            {formatMessageTime(
                                                                msg.created_at,
                                                            )}
                                                        </span>
                                                        {isMine && (
                                                            <div className="flex items-center ml-0.5">
                                                                <svg
                                                                    width="14"
                                                                    height="14"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="3"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                    {msg.is_read && (
                                                                        <polyline
                                                                            points="20 6 9 17 4 12"
                                                                            transform="translate(-4, 0)"
                                                                        />
                                                                    )}
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-5">
                                <div className="flex gap-3 items-center max-w-5xl mx-auto">
                                    <div className="flex-1 flex items-center gap-3 bg-[#EAE8FC] px-3 py-2 rounded-2xl">
                                        <div
                                            className="relative"
                                            ref={emojiRef}
                                        >
                                            <button
                                                onClick={() =>
                                                    setShowEmojis(!showEmojis)
                                                }
                                                className="p-1 text-gray-500 hover:text-[#6367FF] transition-colors"
                                            >
                                                <Smile size={24} />
                                            </button>
                                            {showEmojis && (
                                                <div className="absolute bottom-full left-0 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 grid grid-cols-6 gap-2 w-max z-50">
                                                    {EMOJIS.map((emoji) => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => {
                                                                setMessageInput(
                                                                    (prev) =>
                                                                        prev +
                                                                        emoji,
                                                                );
                                                                setShowEmojis(
                                                                    false,
                                                                );
                                                            }}
                                                            className="text-lg hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder="Send message ..."
                                            value={messageInput}
                                            onChange={(e) =>
                                                setMessageInput(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                handleSendMessage()
                                            }
                                            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!messageInput.trim()}
                                        className="bg-linear-to-r from-blue-900 to-indigo-500 w-12 h-12 rounded-2xl text-white flex items-center justify-center cursor-pointer shrink-0"
                                    >
                                        <Send size={22} className="ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-4">
                            {targetUsername && loadingData ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6367FF]"></div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-[#F5F3FF] rounded-full flex items-center justify-center text-4xl">
                                        💬
                                    </div>
                                    <p className="font-medium text-gray-900">
                                        {targetUsername
                                            ? "Opening conversation..."
                                            : "Select a match to start chatting"}
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-[500px] max-w-[90vw] rounded-[32px] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowReportModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Report User
                        </h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            Why are you reporting this user? We take all reports
                            seriously.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                            {[
                                "Harassment",
                                "Threats",
                                "Catfishing",
                                "Spam",
                                "Inappropriate Content",
                                "Violation of Terms",
                            ].map((reason) => (
                                <label
                                    key={reason}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={reportReasons.includes(reason)}
                                        onChange={() => toggleReason(reason)}
                                        className="w-4 h-4 rounded text-[#6367FF] border-gray-300 focus:ring-[#6367FF] accent-[#6367FF]"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {reason}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="px-6 py-2.5 text-sm bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="px-6 py-2.5 text-sm bg-[#FF4D4D] text-white font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
                            >
                                Send Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
