"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Eye, MessageCircleMore } from "lucide-react";
import girl from "@/public/girl1.png";
import { ApiProfile } from "@/core/types/profiles";
import rating from "@/core/types/Rating";

interface SearchProfileCardProps {
    user: ApiProfile;
    onMatch: (u: ApiProfile) => void;
}

export const SearchProfileCard = ({ user, onMatch }: SearchProfileCardProps) => {
    const [isLiked, setIsLiked] = useState(user.is_liked || user.is_match);
    const [isMatch, setIsMatch] = useState(user.is_match);
    const router = useRouter();

    const statusObj = rating.find((r) =>
        r.name.toLowerCase().includes(user.rating.toLowerCase()),
    );
    const ratingColor = statusObj ? statusObj.color : "#4B4B4B";

    const imageUrl = user.avatar
        ? user.avatar.startsWith("/") && !user.avatar.startsWith("http")
            ? `http://localhost:5001${user.avatar.startsWith("/static") ? user.avatar : "/static" + (user.avatar.startsWith("/") ? "" : "/") + user.avatar}`
            : user.avatar
        : girl.src;

    const toggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const previousState = isLiked;
        const newState = !isLiked;
        setIsLiked(newState);

        try {
            const action = newState ? "like" : "unlike";
            const res = await fetch(
                `http://localhost:5001/api/v1/profile/${user.username}/${action}`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );

            if (!res.ok) {
                setIsLiked(previousState);
            } else {
                const json = await res.json();
                if (json.data?.is_match) {
                    setIsMatch(true);
                    onMatch(user);
                } else if (!newState) {
                    setIsMatch(false);
                }
            }
        } catch (error) {
            console.error("Failed to toggle like", error);
            setIsLiked(previousState);
        }
    };

    return (
        <div
            onClick={() => router.push(`/profile/${user.username}`)}
            className="flex flex-row gap-2 bg-[#F5F3FF] shadow-xl p-3 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer hover:bg-white transition-colors group"
        >
            <div className="relative border-4 border-[#F5F3FF] rounded-2xl shadow-2xl flex-1 group-hover:border-white transition-colors">
                <div
                    className="w-full h-full aspect-square bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
                {isMatch && (
                    <div className="absolute bottom-2 right-2 text-[#6367FF] bg-[#DFD8FF]/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-semibold text-[#6367FF]">
                            Matching
                        </span>
                    </div>
                )}
            </div>
            <div className="w-full flex flex-col justify-between gap-3 py-3 flex-2 min-w-0">
                <div className="flex flex-row justify-between gap-2 min-w-0">
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-xs font-bold truncate text-gray-900">
                            {user.first_name || user.username},{" "}
                            {user.age || "N/A"}
                        </span>
                        <span className="text-[10px] text-gray-500 truncate font-medium">
                            {user.city || "Unknown"}
                            {user.country ? `, ${user.country}` : ""}
                        </span>
                        <span
                            className="text-[10px] font-bold truncate mt-1"
                            style={{ color: ratingColor }}
                        >
                            {statusObj?.name || user.rating}
                        </span>
                    </div>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/profile/${user.username}`);
                        }}
                    >
                        <Eye
                            size={18}
                            className="text-gray-400 hover:text-[#6367FF] transition-colors"
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-3">
                    <div
                        className="flex gap-2 items-center cursor-pointer active:scale-95 transition-transform"
                        onClick={toggleLike}
                    >
                        <Heart
                            size={18}
                            className="text-[#6367FF] transition-colors"
                            fill={isLiked ? "#6367FF" : "transparent"}
                        />
                    </div>
                    {isMatch && (
                        <div
                            className="flex gap-2 items-center cursor-pointer hover:scale-105 transition-transform"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/chat?user=${user.username}`);
                            }}
                        >
                            <MessageCircleMore
                                size={18}
                                className="text-[#6367FF]"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
