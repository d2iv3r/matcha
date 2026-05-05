"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    MoreVertical,
    Shield,
    ShieldBan,
    Eye,
    Flag,
    Smile,
    Send,
    ArrowLeft,
    Check,
    CheckCheck,
} from "lucide-react";
import Image from "next/image";
import { RefObject } from "react";
import girl from "@/public/girl1.png";
import { formatDistanceToNow } from "date-fns";
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
    "😉",
];

interface ChatWindowProps {
    selectedConversation: Conversation | null;
    messages: Message[];
    myId: number | undefined;
    messageInput: string;
    onMessageInputChange: (val: string) => void;
    onSendMessage: () => void;
    showEmojis: boolean;
    setShowEmojis: (val: boolean) => void;
    showMenu: boolean;
    setShowMenu: (val: boolean) => void;
    onViewProfile: () => void;
    onBlockUnblock: () => void;
    onOpenReport: () => void;
    block: boolean;
    messagesEndRef: RefObject<HTMLDivElement | null>;
    inputRef: RefObject<HTMLInputElement | null>;
    emojiRef: RefObject<HTMLDivElement | null>;
    menuRef: RefObject<HTMLDivElement | null>;
    formatUrl: (url: string | null) => string | null;
    formatMessageTime: (dateStr: string) => string;
    onBackToList: () => void;
    mobileView: "list" | "chat";
    hasMoreMessages: boolean;
    onLoadMore: () => void;
}

export const ChatWindow = ({
    selectedConversation,
    messages,
    myId,
    messageInput,
    onMessageInputChange,
    onSendMessage,
    showEmojis,
    setShowEmojis,
    showMenu,
    setShowMenu,
    onViewProfile,
    onBlockUnblock,
    onOpenReport,
    block,
    messagesEndRef,
    inputRef,
    emojiRef,
    menuRef,
    formatUrl,
    formatMessageTime,
    onBackToList,
    mobileView,
    hasMoreMessages,
    onLoadMore,
}: ChatWindowProps) => {
    // ALL hooks must be declared before any early returns (Rules of Hooks)
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const isLoadingMoreRef = useRef(false); // ref for immediate lock (avoids stale closure)
    const prevScrollHeight = useRef<number>(0);

    // Preserve scroll position when older messages are prepended
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || prevScrollHeight.current === 0) return;
        const newScrollHeight = container.scrollHeight;
        const scrollDiff = newScrollHeight - prevScrollHeight.current;
        if (scrollDiff > 0) {
            container.scrollTop += scrollDiff;
        }
        prevScrollHeight.current = 0;
    }, [messages.length]);

    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container || !hasMoreMessages || isLoadingMoreRef.current) return;
        if (container.scrollTop <= 50) {
            isLoadingMoreRef.current = true;
            prevScrollHeight.current = container.scrollHeight;
            setIsLoadingMore(true);
            Promise.resolve(onLoadMore()).finally(() => {
                isLoadingMoreRef.current = false;
                setIsLoadingMore(false);
            });
        }
    }, [hasMoreMessages, onLoadMore]);

    if (!selectedConversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#F9F8FF]">
                <div className="w-20 h-20 bg-[#E2DCFF] rounded-full flex items-center justify-center mb-6 text-[#6367FF]">
                    <Smile size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Welcome to your Chat
                </h2>
                <p className="text-gray-500 text-sm max-w-xs">
                    Select a conversation from the left to start messaging with
                    your matches.
                </p>
            </div>
        );
    }

    const otherUsername =
        selectedConversation.user1_id === myId
            ? selectedConversation.user2_username
            : selectedConversation.user1_username;

    const otherAvatar =
        selectedConversation.user1_id === myId
            ? selectedConversation.user2_avatar
            : selectedConversation.user1_avatar;

    const isOtherOnline =
        selectedConversation.user1_id === myId
            ? selectedConversation.user2_is_online
            : selectedConversation.user1_is_online;

    const otherLastConnection =
        selectedConversation.user1_id === myId
            ? selectedConversation.user2_last_connection
            : selectedConversation.user1_last_connection;

    return (
        <div
            className={`flex-1 flex flex-col min-h-0 bg-[#F9F8FF] ${
                mobileView === "chat" ? "flex" : "hidden lg:flex"
            }`}
        >
            {/* Header */}
            <div className="relative flex flex-row gap-2 items-center p-5 justify-between bg-white border-b border-[#E9E8FF]">
                <div className="flex gap-4 items-center">
                    <button
                        onClick={onBackToList}
                        className="p-2 text-[#6367FF] hover:bg-[#E2DCFF] rounded-xl transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="relative">
                        <Image
                            src={formatUrl(otherAvatar) || girl}
                            alt="Profile"
                            width={50}
                            height={50}
                            className="aspect-square rounded-full object-cover"
                            unoptimized
                        />
                        {isOtherOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#45ff00] border-2 border-white rounded-full"></div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-bold text-gray-900 leading-none">
                            {otherUsername}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-1">
                            {isOtherOnline ? (
                                <>
                                    <span className="text-[10px] font-bold text-[#45ff00] tracking-wider">
                                        Online
                                    </span>
                                </>
                            ) : otherLastConnection ? (
                                <span className="text-[10px] text-gray-400 font-medium">
                                    Last seen{" "}
                                    {formatDistanceToNow(
                                        new Date(otherLastConnection),
                                        { addSuffix: true },
                                    )}
                                </span>
                            ) : (
                                <span className="text-[10px] text-gray-400 font-medium">
                                    Offline
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-gray-500 hover:bg-[#E2DCFF] hover:text-[#6367FF] rounded-xl transition-colors cursor-pointer"
                    >
                        <MoreVertical size={24} />
                    </button>
                    {showMenu && (
                        <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-20 flex flex-col w-44 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={onViewProfile}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 text-xs font-medium cursor-pointer"
                            >
                                <Eye size={14} />
                                <span>View Profile</span>
                            </button>
                            <button
                                onClick={onBlockUnblock}
                                className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 border-t border-gray-50 text-xs font-medium cursor-pointer"
                            >
                                <Shield size={14} />
                                <span>{block ? "Unblock" : "Block User"}</span>
                            </button>
                            <button
                                onClick={onOpenReport}
                                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-50 transition-colors text-xs font-medium w-full text-left cursor-pointer border-t border-gray-50"
                            >
                                <Flag size={16} /> <span>Report</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 min-h-0 scrollbar-hide"
            >
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                        <p className="text-xs font-medium">No messages yet</p>
                    </div>
                ) : (
                    <>
                        {isLoadingMore && (
                            <div className="flex justify-center py-2">
                                <div className="w-4 h-4 border-2 border-[#6367FF] border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                        {messages.map((msg, idx) => {
                        const isMine = msg.sender_id === myId;
                        return (
                            <div
                                key={`msg-${msg.id}-${idx}`}
                                className={`flex ${
                                    isMine ? "justify-end" : "justify-start"
                                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-3 rounded-2xl relative shadow-sm ${
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
                                                : "text-gray-500"
                                        }`}
                                    >
                                        <span className="text-[9px]">
                                            {formatMessageTime(msg.created_at)}
                                        </span>
                                        {isMine && (
                                            <div className="flex items-center ml-0.5">
                                                {msg.is_read ? (
                                                    <CheckCheck
                                                        size={12}
                                                        className="text-white/90"
                                                    />
                                                ) : (
                                                    <Check
                                                        size={12}
                                                        className="text-white/70"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 border-t border-[#E9E8FF] bg-white">
                {block ? (
                    <div className="flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl p-4 gap-3 animate-in fade-in zoom-in-95">
                        <ShieldBan className="text-red-500 w-5 h-5" />
                        <p className="text-xs font-semibold text-red-600">
                            You cannot send messages because you have blocked
                            this user.
                        </p>
                    </div>
                ) : (
                    <div className="flex gap-3 items-center max-w-5xl mx-auto">
                        <div className="relative" ref={emojiRef}>
                            <button
                                onClick={() => setShowEmojis(!showEmojis)}
                                className="p-2 text-gray-500 hover:bg-[#E2DCFF] hover:text-[#6367FF] rounded-xl transition-colors cursor-pointer"
                            >
                                <Smile size={24} />
                            </button>
                            {showEmojis && (
                                <div className="absolute bottom-full left-0 mb-4 p-3 bg-white rounded-2xl shadow-2xl border border-gray-100 grid grid-cols-6 gap-2 w-64 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    {EMOJIS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => {
                                                onMessageInputChange(
                                                    messageInput + emoji,
                                                );
                                                setShowEmojis(false);
                                            }}
                                            className="text-xl hover:scale-125 transition-transform p-1 cursor-pointer"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 bg-[#F5F3FF] rounded-2xl border border-gray-100 p-2 flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={messageInput}
                                onChange={(e) =>
                                    onMessageInputChange(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        onSendMessage();
                                    }
                                }}
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-gray-800"
                            />
                            <button
                                onClick={onSendMessage}
                                disabled={!messageInput.trim()}
                                className="p-2 bg-[#6367FF] text-white rounded-xl hover:bg-[#555DFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#6367FF]/20"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
