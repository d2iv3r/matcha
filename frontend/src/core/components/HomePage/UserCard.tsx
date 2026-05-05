"use client";
import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import girl from "@/public/girl1.png";
import { formatDistanceToNow } from "date-fns";
import { ApiProfile } from "../../types/profiles";

export default function UserCard({
    user,
    statusColor,
    displayRating,
    onMatch,
}: {
    user: ApiProfile;
    statusColor: string;
    displayRating: string;
    onMatch: (u: ApiProfile) => void;
}) {
    const [isLiked, setIsLiked] = useState(user.is_liked || user.is_match);
    const [isMatch, setIsMatch] = useState(user.is_match);
    const [isOnline, setIsOnline] = useState(user.is_online);
    const router = useRouter();

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

    const go_to_profile = (username: string) => {
        router.push(`/profile/${username}`);
    };

    return (
        <div
            onClick={() => go_to_profile(user.username)}
            className="group flex flex-col h-full bg-[#F5F3FF] p-2 shadow-xl rounded-2xl w-full cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
        >
            <div className="w-full aspect-3.5/4 rounded-xl mb-1 overflow-hidden relative group/image">
                <Image
                    src={imageUrl}
                    alt={user.username}
                    fill
                    unoptimized
                    className="object-cover object-center transition-transform duration-500 group-hover/image:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                {isMatch && (
                    <div className="absolute top-3 right-3 bg-[#E2DCFF]/90 backdrop-blur-sm px-3 py-2 rounded-xl z-10 shadow-sm">
                        <p className="text-[9px] text-[#555EFF] font-semibold tracking-wider leading-none">
                            Matching
                        </p>
                    </div>
                )}
                {isOnline && (
                    <div className="absolute top-2.5 left-2 bg-[#45ff00] w-2 h-2 rounded-full border border-white"></div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-[10px] line-clamp-2 italic mb-1">
                        "{user.bio}"
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {user.interests?.slice(0, 3).map((interest, idx: number) => (
                            <span
                                key={`${interest}-${idx}`}
                                className="bg-white/20 backdrop-blur-md text-white text-[8px] px-1.5 py-0.5 rounded-full border border-white/30"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row justify-between items-center gap-2 px-1 py-1 mt-auto">
                <div className="flex flex-col min-w-0 flex-1">
                    <p className="font-bold text-xs md:text-sm text-gray-900 truncate">
                        {user.username},{" "}
                        <span className="">{user.age || "N/A"}</span>
                    </p>
                    <p className="text-gray-500 text-[10px] md:text-xs truncate">
                        {user.city || user.country
                            ? `${user.city}${user.city && user.country ? ", " : ""}${user.country}`
                            : "Unknown"}
                    </p>
                    {user.distance_km !== undefined &&
                        user.distance_km !== null && (
                            <p className="text-[#6367FF] text-[10px] font-semibold">
                                {user.distance_km.toFixed(1)} km away
                            </p>
                        )}
                    <p
                        className="text-[10px] md:text-xs font-bold mt-0.5 truncate"
                        style={{ color: statusColor }}
                    >
                        {displayRating}
                    </p>
                    {!isOnline && user.last_connection ? (
                        <p className="text-gray-400 text-[9px] mt-0.5 truncate">
                            Last seen{" "}
                            {formatDistanceToNow(
                                new Date(user.last_connection),
                                { addSuffix: true },
                            )}
                        </p>
                    ) : (
                        <p className="text-gray-400 text-[9px] mt-0.5 truncate">
                            Currently online
                        </p>
                    )}
                </div>
                <div className="relative flex justify-center items-center group/heart">
                    <Heart
                        color="#6367FF"
                        fill={isLiked ? "#6367FF" : "none"}
                        className="cursor-pointer transition-transform hover:scale-110 active:scale-95 shrink-0"
                        size={25}
                        onClick={toggleLike}
                    />
                    <div className="absolute bottom-full mb-2 hidden group-hover/heart:block whitespace-nowrap bg-gray-800 text-white text-[10px] md:text-xs font-medium px-2 py-1 rounded shadow-lg pointer-events-none fade-in animate-in duration-200">
                        {isLiked ? "Unlike" : "Like"}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
