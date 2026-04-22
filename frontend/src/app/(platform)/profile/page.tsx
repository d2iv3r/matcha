"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import girl from "@/public/girl1.png";
import {
    MapPin,
    GalleryVertical,
    UserRound,
    HandHeart,
    Heart,
} from "lucide-react";
import { useProfile } from "@/core/contexts/ProfileContext";
import { INTERESTS } from "@/core/constants/interests";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"gallery" | "viewers" | "liked">(
        "gallery",
    );
    const { profile, isLoading } = useProfile();
    const [viewers, setViewers] = useState<any[]>([]);
    const [likers, setLikers] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);

    const formatAvatar = (url: string | null) => {
        if (!url) return girl.src;
        if (url.startsWith("/static")) {
            return `http://localhost:5001${url}`;
        }
        return url;
    };

    useEffect(() => {
        if (activeTab === "viewers") {
            setIsFetching(true);
            fetch("http://localhost:5001/api/v1/profile/viewers", { credentials: "include" })
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        setViewers(result.data.viewers);
                    }
                })
                .finally(() => setIsFetching(false));
        } else if (activeTab === "liked") {
            setIsFetching(true);
            fetch("http://localhost:5001/api/v1/profile/likes", { credentials: "include" })
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        setLikers(result.data.likers);
                    }
                })
                .finally(() => setIsFetching(false));
        }
    }, [activeTab]);

    const renderRating = (rating: string) => {
        const ratingMap: Record<string, { label: string; color: string }> = {
            Ghost: { label: "👻 Ghost", color: "#94A3B8" },
            Rising: { label: "📈 Rising", color: "#34D399" },
            Popular: { label: "🔥 Popular", color: "#FB923C" },
            Elite: { label: "💎 Elite", color: "#3B82F6" },
            Iconic: { label: "👑 Iconic", color: "#A855F7" },
        };
        const style = ratingMap[rating] || ratingMap.Ghost;
        return (
            <span style={{ color: style.color }} className="font-bold">
                {style.label}
            </span>
        );
    };
    const [indicatorStyle, setIndicatorStyle] = useState({
        left: 0,
        width: 0,
        top: 0,
        height: 0,
        opacity: 0,
    });
    const [isLiked, setIsLiked] = useState(false);
    const tabsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        const el = tabsRef.current[activeTab];
        if (el) {
            setIndicatorStyle({
                left: el.offsetLeft,
                width: el.offsetWidth,
                top: el.offsetTop,
                height: el.offsetHeight,
                opacity: 1,
            });
        }

        const handleResize = () => {
            const currentEl = tabsRef.current[activeTab];
            if (currentEl) {
                setIndicatorStyle((prev) => ({
                    ...prev,
                    left: currentEl.offsetLeft,
                    width: currentEl.offsetWidth,
                    top: currentEl.offsetTop,
                    height: currentEl.offsetHeight,
                }));
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [activeTab]);


    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="w-full h-full gap-4 flex flex-col items-center bg-[#F5F3FF] rounded-4xl shadow-xl p-4">
                <div className="flex w-full flex-col md:flex-row items-center md:items-stretch gap-2 md:gap-5 h-fit">
                    <Image
                        src={profile?.profile?.avatar || ""}
                        alt="Profile"
                        width={180}
                        height={360}
                        unoptimized
                        priority
                        className="rounded-xl aspect-square md:aspect-4.5/5 object-cover"
                    />
                    <div className="flex flex-col w-full h-full flex-1 min-w-0 md:justify-between items-center md:items-start py-1 gap-2">
                        <div className="flex flex-col gap-3 items-center md:items-start">
                            <div className="flex flex-col gap-1 items-center md:items-start">
                                <h4 className="text-xs text-gray-900">
                                    @{profile?.profile?.username}
                                </h4>
                                <h2 className="font-bold text-gray-900">
                                    {profile?.profile?.first_name} {profile?.profile?.last_name}{", "}
                                    <span className="font-medium">{profile?.profile?.age}</span>
                                </h2>
                                <div className="flex flex-row items-center gap-1">
                                    <MapPin
                                        size={15}
                                        className="text-gray-500"
                                    />
                                    <p className="text-xs text-gray-500 font-medium">
                                        {profile?.profile?.city}, {profile?.profile?.country}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-900 font-medium">
                                popularity:{" "}
                                {renderRating(profile?.profile?.rating || "Ghost")}
                            </p>
                            <p className="text-xs text-gray-900 max-w-[460px] text-center md:text-start">
                                {profile?.profile?.bio}
                            </p>
                        </div>
                        <div className="flex flex-row gap-2 flex-wrap w-full md:max-w-[700px] justify-center md:justify-start items-center md:items-start">
                            {profile?.profile?.interests?.map((tagId) => {
                                const foundInterest = INTERESTS.find(i => i.id === tagId);

                                return (
                                    <div
                                        key={tagId}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E2DCFF] text-[#6367FF]"
                                    >
                                        {foundInterest ? foundInterest.icon : <span className="text-[#6367FF] font-bold text-sm leading-none mr-0.5">#</span>}
                                        <span className="font-semibold text-xs text-[#4B4B4B]">
                                            {foundInterest ? foundInterest.label : tagId}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <hr className="border-px border-[#787afc8e] w-[80%]" />
                <div className="flex w-full flex-col gap-3 items-center flex-1 min-h-0">
                    <div className="flex w-full flex-row justify-center items-center">
                        <div className="relative flex bg-[#E9E8FF] p-2 gap-2 rounded-2xl items-center ">
                            <div
                                className="absolute bg-[#DFD9FF] rounded-xl transition-all duration-300 ease-linear"
                                style={{
                                    left: indicatorStyle.left,
                                    width: indicatorStyle.width,
                                    top: indicatorStyle.top,
                                    height: indicatorStyle.height,
                                    opacity: indicatorStyle.opacity,
                                }}
                            />
                            <div
                                ref={(el) => {
                                    tabsRef.current["gallery"] = el;
                                }}
                                onClick={() => setActiveTab("gallery")}
                                className={`relative z-10 p-2 flex gap-2 items-center flex-col md:flex-row px-2 md:px-4 py-2 rounded-xl cursor-pointer text-xs transition-colors duration-300 ${activeTab === "gallery" ? "text-[#6552FF]" : "hover:bg-[#DFD9FF] text-black"}`}
                            >
                                <GalleryVertical
                                    size={15}
                                    className="hidden md:block md:size-4"
                                />
                                <p>Gallery</p>
                            </div>
                            <div
                                ref={(el) => {
                                    tabsRef.current["viewers"] = el;
                                }}
                                onClick={() => setActiveTab("viewers")}
                                className={`relative z-10 p-2 flex gap-2 items-center flex-col md:flex-row px-2 md:px-4 py-2 rounded-xl cursor-pointer text-xs transition-colors duration-300 ${activeTab === "viewers" ? "text-[#6552FF]" : "hover:bg-[#DFD9FF] text-black"}`}
                            >
                                <UserRound size={15} className="hidden md:block md:size-4" />
                                <p className="text-nowrap">Profile Viewers</p>
                            </div>
                            <div
                                ref={(el) => {
                                    tabsRef.current["liked"] = el;
                                }}
                                onClick={() => setActiveTab("liked")}
                                className={`relative z-10 p-2 flex gap-2 items-center flex-col md:flex-row px-2 md:px-4 py-2 rounded-xl cursor-pointer text-xs transition-colors duration-300 ${activeTab === "liked" ? "text-[#6552FF]" : "hover:bg-[#DFD9FF] text-black"}`}
                            >
                                <HandHeart size={15} className="hidden md:block md:size-4" />
                                <p className="text-nowrap">Liked Profiles</p>
                            </div>
                        </div>
                    </div>
                    {activeTab === "gallery" && (
                        <div className="w-full h-full p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {profile?.profile?.pictures?.map((item, index) => (
                                <Image
                                    key={index}
                                    src={item}
                                    alt={`${profile?.profile?.username}'s picture`}
                                    width={180}
                                    height={250}
                                    unoptimized
                                    priority={index === 0}
                                    className="rounded-xl object-cover w-full h-auto"
                                />
                            ))}
                        </div>
                    )}
                    {activeTab === "viewers" && (
                        <div className="w-full h-full p-2 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {isFetching ? (
                                <div className="col-span-full flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6367FF]"></div>
                                </div>
                            ) : viewers.length > 0 ? (
                                viewers.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-2 bg-[#F5F3FF] p-2 rounded-xl shadow-lg"
                                    >
                                        <div className="relative w-full aspect-square rounded-xl overflow-hidden group/image shrink-0">
                                            <Image
                                                src={formatAvatar(item.viewer_avatar)}
                                                alt="Profile"
                                                width={180}
                                                height={160}
                                                className="object-cover w-full h-full transition-transform duration-500 group-hover/image:scale-110"
                                            />
                                            <div className="absolute z-10 top-0 left-0 w-full flex justify-end items-start p-2 pointer-events-none">
                                                {item.is_match && (
                                                    <div className="bg-[#DFD8FF]/90 backdrop-blur-[2px] px-2 py-1 md:px-3 md:py-1.5 rounded-lg flex justify-center items-center shadow-sm pointer-events-auto">
                                                        <p className="text-[10px] text-[#6367FF] font-semibold tracking-wide">
                                                            Matching
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-2 justify-between items-center px-1">
                                            <div className="flex gap-1 flex-col justify-center min-w-0">
                                                <p className="text-xs text-gray-900 font-bold truncate">
                                                    {item.viewer_age}, {item.viewer_first_name}
                                                </p>
                                                <p className="text-xs text-gray-900 truncate">
                                                    {item.viewer_country}, {item.viewer_city}
                                                </p>
                                            </div>
                                            <div className="relative group flex items-center justify-center">
                                                <Heart
                                                    color="#6367FF"
                                                    fill={item.is_match ? "#6367FF" : "none"}
                                                    className="cursor-pointer transition-transform group-hover:scale-110 active:scale-95 shrink-0"
                                                    size={22}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 opacity-60">
                                    <UserRound size={48} className="text-gray-400" />
                                    <p className="text-gray-500 font-medium text-sm text-center">No profile viewers yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "liked" && (
                        <div className="w-full h-full p-2 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {isFetching ? (
                                <div className="col-span-full flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6367FF]"></div>
                                </div>
                            ) : likers.length > 0 ? (
                                likers.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-2 bg-[#F5F3FF] p-2 rounded-xl shadow-lg"
                                    >
                                        <div className="relative w-full aspect-square rounded-xl overflow-hidden group/image shrink-0">
                                            <Image
                                                src={formatAvatar(item.liker_avatar)}
                                                alt="Profile"
                                                width={180}
                                                height={160}
                                                className="object-cover w-full h-full transition-transform duration-500 group-hover/image:scale-110"
                                            />
                                            <div className="absolute z-10 top-0 left-0 w-full flex justify-end items-start p-2 pointer-events-none">
                                                {item.is_match && (
                                                    <div className="bg-[#DFD8FF]/90 backdrop-blur-[2px] px-2 py-1 md:px-3 md:py-1.5 rounded-lg flex justify-center items-center shadow-sm pointer-events-auto">
                                                        <p className="text-[10px] text-[#6367FF] font-medium tracking-wide">
                                                            Matching
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-2 justify-between items-center px-1">
                                            <div className="flex gap-1 flex-col justify-center min-w-0">
                                                <p className="text-xs text-gray-900 font-bold truncate">
                                                    {item.liker_age}, {item.liker_first_name}
                                                </p>
                                                <p className="text-xs text-gray-900 truncate">
                                                    {item.liker_country}, {item.liker_city}
                                                </p>
                                            </div>
                                            <div className="relative group flex items-center justify-center">
                                                <Heart
                                                    className="text-[#6367FF] fill-[#6367FF] cursor-pointer transition-all group-hover:scale-110 active:scale-95 shrink-0"
                                                    size={22}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 opacity-60">
                                    <HandHeart size={48} className="text-gray-400" />
                                    <p className="text-gray-500 font-medium text-sm text-center">No likes yet</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
