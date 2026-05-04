"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { Conversation } from "@/core/types/chat";
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
    const totalUnread = conversations.reduce(
        (acc, c) => acc + (c.unread_count ?? 0),
        0,
    );

    const filteredMatches = matches.filter((m) =>
        m.username.toLowerCase().includes(searchQuery.toLowerCase()),
    );

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
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                <div className="flex flex-col gap-3 w-full">
                    {filteredMatches.length === 0 ? (
                        <p className="text-center text-[10px] text-gray-500 py-10">
                            {searchQuery ? "No matches found" : "No matches yet"}
                        </p>
                    ) : (
                        filteredMatches.map((match) => {
                            const conv = conversations.find(
                                (c) =>
                                    c.user1_id === match.user_id ||
                                    c.user2_id === match.user_id,
                            );
                            return (
                                <div
                                    key={match.user_id}
                                    className="w-full flex flex-row gap-2 items-center cursor-pointer p-1 hover:bg-[#6367FF]/5 rounded-xl transition-colors"
                                    onClick={() => {
                                        if (conv) onSelectConversation(conv);
                                        else {
                                            const temp: Conversation = {
                                                id: -match.user_id,
                                                user1_id: myId || 0,
                                                user2_id: match.user_id,
                                                user1_username:
                                                    myProfileData?.profile
                                                        ?.username || "",
                                                user2_username: match.username,
                                                user1_avatar:
                                                    myProfileData?.profile
                                                        ?.avatar || null,
                                                user2_avatar: match.avatar,
                                                created_at:
                                                    new Date().toISOString(),
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
                                            src={
                                                formatUrl(match.avatar) || girl
                                            }
                                            alt="Profile"
                                            width={50}
                                            height={50}
                                            className="aspect-square object-cover rounded-full"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1 min-w-0 justify-between">
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
                                                        {conv.unread_count > 9
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
    );
};
