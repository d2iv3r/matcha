import { NotificationType } from "@/core/types/notification";

export const getNotificationConfig = (type: NotificationType) => {
    switch (type) {
        case NotificationType.VIEW:
            return {
                title: "New Viewers 🎉",
                description: "Someone just landed on your profile. See who it is!",
                primaryAction: "View Profile",
                primaryActionUrl: (username: string) => `/profile/${username}`,
            };
        case NotificationType.LIKE:
            return {
                title: "You’ve got a fan! 🎉",
                description: "Someone just liked your profile. Is this the start of your soulmate story?",
                primaryAction: "View Profile",
                primaryActionUrl: (username: string) => `/profile/${username}`,
                secondaryAction: "Like Back",
            };
        case NotificationType.UNLIKE:
            return {
                title: "A connection has changed. 📉",
                description: "Someone has removed their like from your profile. Don't worry, there are plenty of other matches waiting!",
                primaryAction: "View Profile",
                primaryActionUrl: (username: string) => `/profile/${username}`,
            };
        case NotificationType.MATCH:
            return {
                title: "New Match Alert! 🎉",
                description: "You’ve got a new match waiting to connect with you. Start a conversation!",
                primaryAction: "Let’s Chat",
                primaryActionUrl: () => "/chat",
            };
        case NotificationType.MESSAGE:
            return {
                title: "Someone is talking to you! 💌",
                description: "A potential soulmate just reached out. Open the chat to see what they have to say!",
                primaryAction: "Let’s Chat",
                primaryActionUrl: (username: string) => `/chat?user=${username}`,
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

export const formatUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;

    // Ensure the URL starts with /static/
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    const finalPath = cleanPath.startsWith("/static")
        ? cleanPath
        : `/static${cleanPath}`;

    return `http://localhost:5001${finalPath}`;
};
