"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { Conversation } from "@/core/types/chat";
import { useChat } from "@/core/contexts/ChatContext";
import girl from "@/public/girl1.png";

interface ChatSidebarProps {
    conversations: Conversation[];
    matches: any[];
    selectedConversation: Conversation | null;
    onSelectConversation: (conv: Conversation) => void;
    myId: number | undefined;
    myProfileData: any;
    searchQuery: string;
    onSearch: (query: string) => void;
    formatUrl: (url: string | null) => string | null;
    formatMessageTime: (dateStr: string) => string;
    mobileView: "list" | "chat";
}

export const ChatSidebar = ({
    conversations,
    matches,
    selectedConversation,
    onSelectConversation,
    myId,
    myProfileData,
    searchQuery,
    onSearch,
    formatUrl,
    formatMessageTime,
    mobileView,
}: ChatSidebarProps) => {
    const { onlineUsers } = useChat();
    const totalUnread = conversations.reduce(
        (acc, c) => acc + (c.unread_count ?? 0),
        0,
    );

    const conversationUserIds = conversations.map((c) =>
        Number(Number(c.user1_id) === Number(myId) ? c.user2_id : c.user1_id),
    );

    const allItems = [
        ...conversations.map((c) => ({
            id: c.id,
            userId:
                Number(c.user1_id) === Number(myId) ? c.user2_id : c.user1_id,
            username:
                Number(c.user1_id) === Number(myId)
                    ? c.user2_username
                    : c.user1_username,
            avatar:
                Number(c.user1_id) === Number(myId)
                    ? c.user2_avatar
                    : c.user1_avatar,
            isOnline:
                onlineUsers[
                    Number(
                        Number(c.user1_id) === Number(myId)
                            ? c.user2_id
                            : c.user1_id,
                    )
                ]?.is_online ??
                (Number(c.user1_id) === Number(myId)
                    ? c.user2_is_online
                    : c.user1_is_online),
            lastMessage: c.last_message,
            lastMessageAt: c.last_message_at,
            unreadCount: c.unread_count,
            created_at: c.created_at,
            isConv: true,
            raw: c,
        })),
        ...matches
            .filter(
                (m) => !conversationUserIds.includes(Number(m.user_id)),
            )
            .map((m) => ({
                id: -m.user_id,
                userId: m.user_id,
                username: m.username,
                avatar: m.avatar,
                isOnline: m.is_online,
                lastMessage: null,
                lastMessageAt: null,
                unreadCount: 0,
                created_at: new Date().toISOString(),
                isConv: false,
                raw: m,
            })),
    ]
        .filter((item) =>
            item.username?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
            const timeA = a.lastMessageAt || a.created_at;
            const timeB = b.lastMessageAt || b.created_at;
            return new Date(timeB).getTime() - new Date(timeA).getTime();
        });

    return (
        <div
            className={`flex flex-col gap-3 p-5 w-full lg:w-[25%] shrink-0 ${
                mobileView === "chat" ? "hidden" : "flex"
            }`}
        >
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Messages</h1>
                {totalUnread > 0 && (
                    <span className="bg-[#6367FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {totalUnread} new
                    </span>
                )}
            </div>
            <div className="flex gap-2 bg-[#E9E8FF] p-1 text-xs rounded-lg items-center text-[#6367FF] mb-2">
                <Search size={20} />
                <input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full bg-[#E9E8FF] outline-none text-[#6367FF]"
                />
            </div>
            <hr className="border-[#C6BAFF] py-1" />
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col gap-3 w-full">
                    {allItems.length === 0 ? (
                        <p className="text-center text-[10px] text-gray-500 py-10">
                            {searchQuery
                                ? "No results found"
                                : "No messages or matches yet"}
                        </p>
                    ) : (
                        allItems.map((item) => (
                            <div
                                key={item.id}
                                className="w-full flex flex-row gap-2 items-center cursor-pointer"
                                onClick={() => {
                                    if (item.isConv) {
                                        onSelectConversation(item.raw as Conversation);
                                    } else {
                                        const temp: Conversation = {
                                            id: -item.userId,
                                            user1_id: myId || 0,
                                            user2_id: item.userId,
                                            user1_username:
                                                myProfileData?.profile
                                                    ?.username || "",
                                            user2_username: item.username,
                                            user1_avatar:
                                                myProfileData?.profile
                                                    ?.avatar || null,
                                            user2_avatar: item.avatar,
                                            created_at: new Date().toISOString(),
                                            last_message: null,
                                            last_message_at: null,
                                            unread_count: 0,
                                        };
                                        onSelectConversation(temp);
                                    }
                                }}
                            >
                                <div className="relative">
                                    <Image
                                        src={formatUrl(item.avatar) || girl}
                                        alt="Profile"
                                        width={48}
                                        height={48}
                                        className={`aspect-square object-cover rounded-full border-2 shadow-sm ${
                                            selectedConversation?.id === item.id ? "border-white/30" : "border-white"
                                        }`}
                                        unoptimized
                                    />
                                    {item.isOnline && (
                                        <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#45ff00] border-2 border-white rounded-full shadow-sm"></div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-0.5 flex-1 min-w-0 justify-center">
                                    <h3 className={`text-xs font-bold truncate `}>
                                        {item.username}
                                    </h3>
                                    <p className={`text-[10px] truncate max-w-[120px] `}>
                                        {item.lastMessage || "New Match ✨"}
                                    </p>
                                </div>
                                <div className="flex flex-col h-full gap-1 justify-between items-end">
                                    <p className={`text-[9px] text-gray-500`}>
                                        {item.lastMessageAt
                                            ? formatMessageTime(item.lastMessageAt)
                                            : ""}
                                    </p>
                                    <div className="flex flex-col gap-1 h-4">
                                        {item.unreadCount ? (
                                            <div className="bg-[#6367FF] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-sm">
                                                <p className="text-[9px] text-white font-bold">
                                                    {(item.unreadCount || 0) > 9
                                                        ? "+9"
                                                        : item.unreadCount}
                                                </p>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
