"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ProfileData {
    profile: {
        age: number;
        avatar: string;
        bio: string;
        city: string;
        country: string;
        date_of_birth: string;
        email: string;
        first_name: string;
        gender: string;
        interests: string[];
        last_name: string;
        pictures: string[];
        rating: string;
        user_id: number;
        username: string;
    };
    // profile_likes: {
    //     recent_likers: string[];
    //     total_likes: number;
    // }
    // profile_views: {
    //     recent_viewers: string[];
    //     total_views: number;
    // }
}

interface ProfileContextType {
    profile: ProfileData | null;
    isLoading: boolean;
    error: string | null;
    refetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:5001/api/v1/accounts/profile", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if (!res.ok) {
                throw new Error("Failed to fetch profile");
            }
            
            const jsonResponse = await res.json();
            const data = jsonResponse.data;

            // Helpers
            const formatUrl = (url: string | null) => {
                if (!url) return url;
                if (url.startsWith('/static')) {
                    return `http://localhost:5001${url}`;
                }
                return url;
            };

            const parsePostgresArray = (str: any) => {
                if (!str || typeof str !== "string") return Array.isArray(str) ? str : [];
                if (!str.startsWith("{") || !str.endsWith("}")) return [str];
                
                const content = str.slice(1, -1);
                if (!content) return [];

                return content.split(',').map(item => {
                    item = item.trim();
                    if (item.startsWith('"') && item.endsWith('"')) {
                        return item.slice(1, -1).replace(/\\"/g, '"');
                    }
                    return item;
                });
            };

            if (data?.profile) {
                data.profile.avatar = formatUrl(data.profile.avatar);
                if (data.profile.pictures && Array.isArray(data.profile.pictures)) {
                    data.profile.pictures = data.profile.pictures.map(formatUrl);
                }
                data.profile.interests = parsePostgresArray(data.profile.interests);
            }

            setProfile(data);
        } catch (err: any) {
            console.error("Error pulling profile:", err);
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };
    // console.log("---- profile is ===> :", profile);

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, isLoading, error, refetchProfile: fetchProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
}
