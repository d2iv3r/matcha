import React from "react";

interface NotificationHeaderProps {
    hasNotifications: boolean;
    onMarkAllAsRead: () => void;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
    hasNotifications,
    onMarkAllAsRead,
}) => {
    return (
        <div className="w-full gap-5 flex px-4">
            <div className="flex flex-row items-center justify-between w-full gap-3">
                <div className="flex items-center gap-3 flex-1">
                    <h4 className="text-md text-[#6367FF] font-medium whitespace-nowrap uppercase tracking-wider">
                        Activity
                    </h4>
                    <hr className="w-full h-px text-[#6367FF]" />
                </div>
                {hasNotifications && (
                    <button
                        onClick={onMarkAllAsRead}
                        className="text-xs text-[#6367FF] font-semibold hover:underline px-2"
                    >
                        Mark all as read
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationHeader;
