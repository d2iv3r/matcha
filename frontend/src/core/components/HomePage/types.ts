export interface ApiProfile {
    username: string;
    first_name?: string;
    last_name?: string;
    age: number | null;
    city: string | null;
    country: string | null;
    distance_km?: number | null;
    rating: string;
    avatar?: string | null;
    is_match: boolean;
    is_liked: boolean;
    user_id: number;
    interests?: string[];
    bio?: string;
}
