import React from "react";

const EmptyNotifications: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-60">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-4xl">🔔</span>
            </div>
            <p className="text-sm font-medium text-gray-500">
                No notifications yet
            </p>
        </div>
    );
};

export default EmptyNotifications;
