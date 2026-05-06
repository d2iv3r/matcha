import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import girl from "@/public/girl1.png";
import { getNotificationConfig, formatUrl } from "./notificationUtils";

interface NotificationItemProps {
    notification: any;
    onAction: (id: number, url: string) => void;
    onSecondaryAction: (actor: any, actionLabel: string) => Promise<void>;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onAction,
    onSecondaryAction,
}) => {
    const config = getNotificationConfig(notification.type);
    const actor = notification.data;
    const avatarUrl = formatUrl(
        (actor as any)?.avatar || (actor as any)?.sender_avatar || null,
    );

    let time = "00:00";
    try {
        if (notification.created_at) {
            time = format(new Date(notification.created_at), "hh:mm a");
        }
    } catch (e) {}

    const username = (actor as any)?.username || (actor as any)?.sender_username || "";

    return (
        <div
            className={`flex items-start justify-between gap-4 w-full min-h-[100px] transition-all relative ${notification.is_read ? "opacity-60" : ""}`}
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
                <div className="flex flex-row justify-between md:items-center w-full">
                    <p className="text-xs md:text-sm font-extrabold">
                        {config.title}
                    </p>
                    <p className="text-[#AEB0FF] text-[10px] font-medium text-nowrap">
                        {time}
                    </p>
                </div>
                <h3 className="text-[#131313] text-xs md:text-sm">
                    {notification.message || config.description}
                </h3>
                <div className="flex flex-row items-center gap-3 mt-1">
                    <button
                        onClick={() =>
                            onAction(notification.id, config.primaryActionUrl(username))
                        }
                        className="bg-[#6367FF] text-white text-[10px] font-semibold px-3 md:px-4 py-1.5 rounded-full hover:bg-[#5255e6] transition-colors"
                    >
                        {config.primaryAction}
                    </button>
                    {config.secondaryAction && (
                        <button
                            onClick={() =>
                                onSecondaryAction(actor, config.secondaryAction!)
                            }
                            className="text-[#6367FF] text-[10px] font-semibold px-3 md:px-4 py-1.5 rounded-full border border-[#6367FF] hover:bg-[#d3d4fb] transition-all"
                        >
                            {config.secondaryAction}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;
