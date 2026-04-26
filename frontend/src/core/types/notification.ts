export enum NotificationType {
    MATCH = "MATCH",
    LIKE = "LIKE",
    UNLIKE = "UNLIKE",
    VIEW = "VIEW",
    MESSAGE = "MESSAGE",
}

export interface NotificationActor {
    username: string;
    avatar: string | null;
    content?: string; // For MESSAGE type
}

export interface Notification {
    id: number;
    user_id: number;
    actor_id: number | null;
    type: NotificationType;
    message: string;
    data: NotificationActor | null;
    entity_id: number | null;
    is_read: boolean;
    created_at: string;
}

export interface NotificationsResponse {
    notifications: Notification[];
    count: number;
}
