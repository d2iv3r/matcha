"use client";
import { useState, useEffect } from "react";
import { ShieldBan } from "lucide-react";
import Image from "next/image";

export default function Blocked() {
    const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBlockedUsers = async () => {
        try {
            const res = await fetch(
                "http://localhost:5001/api/v1/profile/blocks",
                {
                    credentials: "include",
                },
            );
            if (res.ok) {
                const json = await res.json();
                setBlockedUsers(json.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch blocked users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlockedUsers();
    }, []);

    const handleUnblock = async (username: string) => {
        try {
            const res = await fetch(
                `http://localhost:5001/api/v1/profile/${username}/unblock`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );
            if (res.ok) {
                // Remove from local state
                setBlockedUsers((prev) =>
                    prev.filter((u) => u.username !== username),
                );
            }
        } catch (err) {
            console.error("Failed to unblock user:", err);
        }
    };

    const formatUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        const finalPath = cleanPath.startsWith("/static")
            ? cleanPath
            : `/static${cleanPath}`;
        return `http://localhost:5001${finalPath}`;
    };

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6367FF]"></div>
            </div>
        );
    }

    if (blockedUsers.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                <ShieldBan size={48} className="text-gray-400" />
                <p className="text-sm font-medium text-gray-500">
                    No blocked users
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-4 grid lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {blockedUsers.map((user, index) => {
                return (
                    <div key={index} className="w-full px-1 py-1">
                        <div className="flex gap-3 flex-row min-w-0 bg-white flex-1 p-3 rounded-3xl border border-gray-100 hover:border-[#6367FF]/20 transition-all shadow-sm">
                            <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden shadow-lg shrink-0 border-3 border-gray-50">
                                <Image
                                    src={formatUrl(user.avatar) || ""}
                                    alt="Profile"
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                                <div className="flex flex-col justify-start">
                                    <p className="font-bold text-xs md:text-sm text-gray-900 truncate">
                                        {user.first_name} {user.last_name},{" "}
                                        <span className="">{user.age}</span>
                                    </p>
                                    <p className="text-gray-500 text-[10px] truncate">
                                        {user.city}, <span>{user.country}</span>
                                    </p>
                                    <p className="text-gray-500 text-[10px] truncate">
                                        {user.rating}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleUnblock(user.username)}
                                    className="relative group w-fit p-1.5 rounded-xl hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                                >
                                    <ShieldBan className="w-4 h-4 text-red-500" />
                                    <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2 px-2 py-1 bg-[#4B4B4B] text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-sm shadow-black/10">
                                        Unblock
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
