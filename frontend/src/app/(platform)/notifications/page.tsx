"use client";

import React from "react";
import Image from "next/image";
import { useNotifications } from "@/core/contexts/NotificationContext";
import { NotificationType } from "@/core/types/notification";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import girl from "@/public/girl1.png";
import MatchOverlay from "@/core/components/MatchOverlay";
import { useProfile } from "@/core/contexts/ProfileContext";

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

    const getNotificationConfig = (type: NotificationType) => {
        switch (type) {
            case NotificationType.VIEW:
                return {
                    title: "New Viewers 🎉",
                    description:
                        "Someone just landed on your profile. See who it is!",
                    primaryAction: "View Profile",
                    primaryActionUrl: (username: string) =>
                        `/profile/${username}`,
                };
            case NotificationType.LIKE:
                return {
                    title: "You’ve got a fan! 🎉",
                    description:
                        "Someone just liked your profile. Is this the start of your soulmate story?",
                    primaryAction: "View Profile",
                    primaryActionUrl: (username: string) =>
                        `/profile/${username}`,
                    secondaryAction: "Like Back",
                };
            case NotificationType.UNLIKE:
                return {
                    title: "A connection has changed. 📉",
                    description:
                        "Someone has removed their like from your profile. Don't worry, there are plenty of other matches waiting!",
                    primaryAction: "View Profile",
                    primaryActionUrl: (username: string) =>
                        `/profile/${username}`,
                };
            case NotificationType.MATCH:
                return {
                    title: "New Match Alert! 🎉",
                    description:
                        "You’ve got a new match waiting to connect with you. Start a conversation!",
                    primaryAction: "Let’s Chat",
                    primaryActionUrl: () => "/chat",
                };
            case NotificationType.MESSAGE:
                return {
                    title: "Someone is talking to you! 💌",
                    description:
                        "A potential soulmate just reached out. Open the chat to see what they have to say!",
                    primaryAction: "Let’s Chat",
                    primaryActionUrl: () => "/chat",
                };
            default:
                return {
                    title: "Notification",
                    description: "You have a new update.",
                    primaryAction: "View",
                    primaryActionUrl: () => "#",
                };
        }
    };

    const formatUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;

        const cleanUrl = url.startsWith("/") ? url : `/${url}`;
        if (cleanUrl.startsWith("/static")) {
            return `http://localhost:5001${cleanUrl}`;
        }
        // If it doesn't start with http or /static, but might be a local path
        if (
            !url.startsWith("http") &&
            (url.includes("avatars/") || url.includes("media/"))
        ) {
            return `http://localhost:5001${cleanUrl}`;
        }
        return url;
    };

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
                console.log(
                    `Action ${action} successful for ${actor.username}`,
                );
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
        <div className="w-full h-full flex flex-col p-4">
            <div className="w-full min-h-full gap-5 flex flex-col items-center bg-[#F5F3FF] rounded-4xl shadow-xl p-6 overflow-y-auto scrollbar-hide">
                <div className="flex flex-row items-center justify-between w-full gap-3 mb-2">
                    <div className="flex items-center gap-3 flex-1">
                        <h4 className="text-md text-[#AEB0FF] font-medium whitespace-nowrap uppercase tracking-wider">
                            Activity
                        </h4>
                        <hr className="w-full h-px text-[#AEB0FF]" />
                    </div>
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-[#6367FF] font-semibold hover:underline px-2"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-60">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-4xl">🔔</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            No notifications yet
                        </p>
                    </div>
                ) : (
                    notifications.map((notif) => {
                        const config = getNotificationConfig(notif.type);
                        const actor = notif.data;
                        const avatarUrl = formatUrl(actor?.avatar || null);

                        let time = "00:00";
                        try {
                            if (notif.created_at) {
                                time = format(
                                    new Date(notif.created_at),
                                    "hh:mm a",
                                );
                            }
                        } catch (e) {}

                        return (
                            <div
                                key={notif.id}
                                className={`flex items-start justify-between gap-4 w-full min-h-[100px] transition-all relative ${notif.is_read ? "opacity-60" : ""}`}
                            >
                                <div className="w-[100px] h-[100px] rounded-3xl border-3 shadow-md shadow-gray-500/30 border-[#F5F3FF] overflow-hidden shrink-0">
                                    <Image
                                        src={avatarUrl || girl}
                                        alt={actor?.username || "user"}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="w-full h-full flex flex-1 flex-col justify-center gap-1">
                                    <div className="flex items-center gap-2">
                                        <h6 className="text-xs font-bold text-black">
                                            {config.title}
                                        </h6>
                                        {!notif.is_read && (
                                            <span className="w-2 h-2 bg-[#6367FF] rounded-full"></span>
                                        )}
                                    </div>
                                    <p className="text-xs mb-2 text-gray-500 font-medium leading-tight max-w-[85%]">
                                        {notif.message || config.description}
                                    </p>
                                    <div className="w-full flex gap-3 mt-1">
                                        <button
                                            onClick={() =>
                                                handleAction(
                                                    notif.id,
                                                    config.primaryActionUrl(
                                                        actor?.username || "",
                                                    ),
                                                )
                                            }
                                            className="w-fit py-1.5 px-5 bg-linear-to-r from-[#6367FF] to-[#3B3E99] font-medium text-[10px] tracking-tighter text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#6367FF]/20"
                                        >
                                            {config.primaryAction}
                                        </button>
                                        {config.secondaryAction && (
                                            <button
                                                onClick={() =>
                                                    handleSecondaryAction(
                                                        actor,
                                                        config.secondaryAction ||
                                                            "",
                                                    )
                                                }
                                                className="w-fit py-1.5 px-5 border-[#3B3E99] border font-medium text-[10px] tracking-tighter text-[#3B3E99] rounded-lg hover:bg-[#3B3E99]/5 transition-colors"
                                            >
                                                {config.secondaryAction}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="shrink-0 pt-1 absolute top-0 right-0">
                                    <span className="text-[10px] md:text-xs text-[#AEB0FF] font-bold">
                                        {time}
                                    </span>
                                </div>
                            </div>
                        );
                    })
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
