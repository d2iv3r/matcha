"use client";

import React from "react";
import Image from "next/image";
import girl from "@/public/girl1.png";
import { useNotifications } from "@/core/contexts/NotificationContext";
import { isToday, isYesterday, format } from "date-fns";
import { useRouter } from "next/navigation";
import MatchOverlay from "@/core/constants/MatchOverlay";
import { useProfile } from "@/core/contexts/ProfileContext";
import NotificationHeader from "@/core/components/NotificationPage/NotificationHeader";
import EmptyNotifications from "@/core/components/NotificationPage/EmptyNotifications";
import NotificationItem from "@/core/components/NotificationPage/NotificationItem";
import { formatUrl } from "@/core/components/NotificationPage/notificationUtils";

export default function NotificationsPage() {
    const {
        notifications,
        markAsRead,
        markAllAsRead,
        isLoading,
        hasMore,
        fetchMore,
    } = useNotifications();
    const router = useRouter();
    const { profile: myProfileData } = useProfile();
    const [matchModal, setMatchModal] = React.useState<{
        isOpen: boolean;
        user: any;
    }>({ isOpen: false, user: null });

    const handleAction = (id: number, url: string) => {
        markAsRead(id);
        router.push(url);
    };

    const handleSecondaryAction = async (actor: any, actionLabel: string) => {
        if (!actor?.username) return;

        const action = actionLabel.toLowerCase().includes("unlike")
            ? "unlike"
            : "like";

        try {
            const res = await fetch(
                `http://localhost:5001/api/v1/profile/${actor.username}/${action}`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );
            if (res.ok) {
                const jsonResponse = await res.json();
                if (jsonResponse.data?.is_match && action === "like") {
                    setMatchModal({ isOpen: true, user: actor });
                }
            }
        } catch (err) {
            console.error("Secondary action failed:", err);
        }
    };

    if (isLoading && notifications.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6367FF]"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-4 gap-5">
            <NotificationHeader 
                hasNotifications={notifications.length > 0} 
                onMarkAllAsRead={markAllAsRead} 
            />
            <div className="w-full h-fit min-h-fit md:min-h-[calc(100vh-12rem)] gap-5 flex flex-col items-center bg-[#F5F3FF] rounded-4xl shadow-xl">
                <div className="w-full h-fit min-h-fit md:min-h-[calc(100vh-12rem)] gap-5 flex flex-col items-center bg-[#F5F3FF] rounded-4xl p-6 overflow-y-auto scrollbar-hide">
                    {notifications.length === 0 ? (
                        <EmptyNotifications />
                    ) : (
                        Object.entries(
                            notifications.reduce(
                                (groups, notif) => {
                                    const date = new Date(notif.created_at);
                                    let label = "";
                                    if (isToday(date)) label = "Today";
                                    else if (isYesterday(date))
                                        label = "Yesterday";
                                    else label = format(date, "MMMM d, yyyy");

                                    if (!groups[label]) groups[label] = [];
                                    groups[label].push(notif);
                                    return groups;
                                },
                                {} as Record<string, typeof notifications>,
                            ),
                        ).map(([label, groupItems]) => (
                            <div
                                key={label}
                                className="w-full flex flex-col gap-5"
                            >
                                <div className="flex items-center gap-3 w-full opacity-60">
                                    <span className="text-[10px] font-bold text-[#AEB0FF] uppercase tracking-widest whitespace-nowrap">
                                        {label}
                                    </span>
                                    <hr className="w-full h-px text-[#AEB0FF]" />
                                </div>

                                {groupItems.map((notif) => (
                                    <NotificationItem 
                                        key={notif.id}
                                        notification={notif}
                                        onAction={handleAction}
                                        onSecondaryAction={handleSecondaryAction}
                                    />
                                ))}
                            </div>
                        ))
                    )}
                    {notifications.length > 0 && hasMore && (
                        <div className="w-full flex justify-center py-4">
                            <button
                                onClick={fetchMore}
                                disabled={isLoading}
                                className="text-xs font-bold text-[#6367FF] hover:bg-[#6367FF]/5 px-6 py-2 rounded-xl transition-all border border-[#6367FF]/20 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-[#6367FF] border-t-transparent rounded-full animate-spin"></div>
                                        Loading...
                                    </>
                                ) : (
                                    "Load More Activity"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {matchModal.isOpen && (
                <MatchOverlay
                    isOpen={matchModal.isOpen}
                    onClose={() => setMatchModal({ isOpen: false, user: null })}
                    myAvatar={myProfileData?.profile?.avatar || null}
                    matchAvatar={formatUrl(matchModal.user?.avatar || null)}
                    matchName={
                        matchModal.user?.first_name ||
                        matchModal.user?.username ||
                        "Someone"
                    }
                    onChat={() => router.push("/chat")}
                />
            )}
        </div>
    );
}
