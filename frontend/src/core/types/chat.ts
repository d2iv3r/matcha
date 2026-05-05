export interface Conversation {
    id: number;
    user1_id: number;
    user2_id: number;
    created_at: string;
    user1_username: string;
    user2_username: string;
    user1_avatar: string | null;
    user2_avatar: string | null;
    user1_is_online?: boolean;
    user2_is_online?: boolean;
    user1_last_connection?: string;
    user2_last_connection?: string;
    last_message: string | null;
    last_message_at: string | null;
    unread_count?: number;
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    is_read: boolean;
    created_at: string;
}
