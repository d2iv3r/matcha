"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    MapPin,
    GalleryVertical,
    UserRound,
    HandHeart,
    Heart,
    X,
} from "lucide-react";
import { INTERESTS } from "@/core/constants/interests";
import rating from "@/core/types/Rating";

import girl from "@/public/girl1.png";

export default function MyProfileView({
    profileData,
    activeTab,
    setActiveTab,
    viewers,
    setViewers,
    likers,
    setLikers,
    onMatch,
    isFetching,
}: any) {
    const router = useRouter();
    const [indicatorStyle, setIndicatorStyle] = useState({
        left: 0,
        width: 0,
        top: 0,
        height: 0,
        opacity: 0,
    });
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const tabsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const handleLikeToggle = async (
        username: string,
        currentIsLiked: boolean,
        listType: "viewers" | "likers",
    ) => {
        const newIsLiked = !currentIsLiked;
        const action = newIsLiked ? "like" : "unlike";

        try {
            const res = await fetch(
                `http://localhost:5001/api/v1/profile/${username}/${action}`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );

            if (res.ok) {
                const json = await res.json();
                const isMatch = json.data?.is_match || false;

                const updateList = (list: any[]) =>
                    list.map((item,index) => {
                        const itemUsername =
                            listType === "viewers"
                                ? item.viewer_username
                                : item.liker_username;
                        if (itemUsername === username) {
                            return {
                                ...item,
                                is_liked: newIsLiked,
                                is_match: isMatch,
                            };
                        }
                        return item;
                    });

                if (listType === "viewers") setViewers(updateList(viewers));
                else setLikers(updateList(likers));

                if (isMatch) {
                    const matchedUser = (
                        listType === "viewers" ? viewers : likers
                    ).find(
                        (u: any) =>
                            (listType === "viewers"
                                ? u.viewer_username
                                : u.liker_username) === username,
                    );
                    if (matchedUser) {
                        onMatch({
                            username: username,
                            first_name:
                                listType === "viewers"
                                    ? matchedUser.viewer_first_name
                                    : matchedUser.liker_first_name,
                            avatar:
                                listType === "viewers"
                                    ? matchedUser.viewer_avatar
                                    : matchedUser.liker_avatar,
                        });
                    }
                }
            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    };

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
    }, [activeTab, profileData]);

    const renderRating = (userRating: string) => {
        const ratingObj =
            rating.find((r) => r.name.includes(userRating)) || rating[0];
        return (
            <span style={{ color: ratingObj.color }} className="font-bold">
                {ratingObj.name}
            </span>
        );
    };

    const formatAvatar = (url: string | null) => {
        if (!url) return girl.src;
        if (url.startsWith("http")) return url;

        // Ensure the URL starts with /static/
        const cleanPath = url.startsWith("/") ? url : `/${url}`;
        const finalPath = cleanPath.startsWith("/static")
            ? cleanPath
            : `/static${cleanPath}`;

        return `http://localhost:5001${finalPath}`;
    };

    // Combine avatar and pictures for the gallery
    const galleryImages = [
        ...(profileData.avatar ? [profileData.avatar] : []),
        ...(Array.isArray(profileData.pictures) ? profileData.pictures : []),
    ];

    return (
        <div className="w-full h-fit md:h-full gap-4 flex flex-col items-center bg-[#F5F3FF] rounded-4xl shadow-xl p-4 md:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex w-full flex-col md:flex-row items-center md:items-stretch gap-2 md:gap-5 h-fit">
                <div className="relative w-[180px] h-[180px] md:h-[220px] shrink-0">
                    <Image
                        src={formatAvatar(profileData.avatar)}
                        alt="Profile"
                        fill
                        unoptimized
                        priority
                        className="rounded-xl object-cover"
                    />
                </div>

                <div className="flex flex-col w-full h-full flex-1 min-w-0 md:justify-between items-center md:items-start py-1 gap-2">
                    <div className="flex flex-col gap-3 items-center md:items-start w-full">
                        <div className="flex flex-col gap-1 items-center md:items-start">
                            <h4 className="text-xs text-gray-900">
                                @{profileData.username}
                            </h4>
                            <h2 className="font-bold text-gray-900">
                                {profileData.first_name || profileData.username}{" "}
                                {profileData.last_name || ""}
                                {", "}
                                <span className="font-medium">
                                    {profileData.age}
                                </span>
                            </h2>
                            <div className="flex flex-row items-center gap-1">
                                <MapPin size={15} className="text-gray-500" />
                                <p className="text-xs text-gray-500 font-medium">
                                    {profileData.city}, {profileData.country}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-900 font-medium">
                            popularity:{" "}
                            {renderRating(profileData.rating || "Ghost")}
                        </p>
                        <p className="text-xs text-gray-900 max-w-[460px] text-center md:text-start">
                            {profileData.bio}
                        </p>
                    </div>
                    <div className="flex flex-row gap-2 flex-wrap w-full md:max-w-[700px] justify-center md:justify-start items-center md:items-start">
                        {Array.isArray(profileData.interests) ? (
                            profileData.interests.map((tagId: string) => {
                                const foundInterest = INTERESTS.find(
                                    (i) =>
                                        i.id.toLowerCase() ===
                                            tagId.toLowerCase() ||
                                        i.label.toLowerCase() ===
                                            tagId.toLowerCase(),
                                );
                                return (
                                    <div
                                        key={tagId}
                                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#E2DCFF] text-[#6367FF]"
                                    >
                                        {foundInterest ? (
                                            foundInterest.icon
                                        ) : (
                                            <span className="text-[#6367FF] font-bold text-[10px] leading-none">
                                                #
                                            </span>
                                        )}
                                        <span className="font-semibold text-[10px] text-[#4B4B4B]">
                                            {foundInterest
                                                ? foundInterest.label
                                                : tagId}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-xs text-gray-400">
                                No interests listed
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <hr className="border-px border-[#787afc8e] w-[80%] my-2" />

            <div className="flex w-full flex-col gap-3 items-center flex-1 min-h-0">
                <div className="relative flex bg-[#E9E8FF] p-2 gap-2 rounded-2xl items-center ">
                    <div
                        className="absolute bg-[#DFD9FF] rounded-xl transition-all duration-300 ease-linear"
                        style={{ ...indicatorStyle }}
                    />
                    {["gallery", "viewers", "liked"].map((tab,index) => (
                        <div
                            key={`${tab}-${index}`}
                            ref={(el) => {
                                tabsRef.current[tab] = el;
                            }}
                            onClick={() => setActiveTab(tab as any)}
                            className={`relative z-10 p-2 flex gap-2 items-center flex-col md:flex-row px-4 py-2 rounded-xl cursor-pointer text-xs transition-colors duration-300 ${activeTab === tab ? "text-[#6552FF]" : "hover:bg-[#DFD9FF] text-black"}`}
                        >
                            {tab === "gallery" && (
                                <GalleryVertical
                                    size={15}
                                    className="hidden md:block md:size-4"
                                />
                            )}
                            {tab === "viewers" && (
                                <UserRound
                                    size={15}
                                    className="hidden md:block md:size-4"
                                />
                            )}
                            {tab === "liked" && (
                                <HandHeart
                                    size={15}
                                    className="hidden md:block md:size-4"
                                />
                            )}
                            <p className="capitalize">
                                {tab === "gallery"
                                    ? "Gallery"
                                    : tab === "viewers"
                                      ? "Profile Viewers"
                                      : "Liked Profiles"}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="w-full flex-1">
                    {activeTab === "gallery" && (
                        <div className="w-full h-full p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start pb-6">
                            {galleryImages.length > 0 ? (
                                galleryImages.map(
                                    (item: string, index: number) => (
                                        <div
                                            key={index}
                                            className="relative aspect-3/4 w-full cursor-zoom-in"
                                            onClick={() =>
                                                setExpandedImage(item)
                                            }
                                        >
                                            <Image
                                                src={formatAvatar(item)}
                                                alt="Gallery"
                                                fill
                                                unoptimized
                                                className="rounded-xl object-cover shadow-md"
                                            />
                                        </div>
                                    ),
                                )
                            ) : (
                                <div className="col-span-full flex items-center justify-center py-20 opacity-40 grayscale">
                                    <GalleryVertical size={64} />
                                    <p className="ml-4 font-bold">
                                        No photos yet
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "viewers" && (
                        <div className="w-full h-full p-2 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start">
                            {viewers.length > 0 ? (
                                viewers.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-2 bg-[#F5F3FF] p-2 rounded-xl shadow-lg hover:translate-y-[-4px] transition-transform cursor-pointer"
                                        onClick={() =>
                                            router.push(
                                                `/profile/${item.viewer_username}`,
                                            )
                                        }
                                    >
                                        <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                                            <Image
                                                src={formatAvatar(
                                                    item.viewer_avatar,
                                                )}
                                                alt="Viewer"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                            {item.is_match && (
                                                <div className="absolute top-2 right-2 bg-[#E2DCFF]/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                                                    <p className="text-[8px] text-[#555EFF] font-semibold tracking-wider">
                                                        Matching
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex w-full justify-between items-center">
                                            <div className="p-1">
                                                <p className="text-xs text-gray-900 font-bold truncate">
                                                    {item.viewer_first_name},{" "}
                                                    {item.viewer_age}
                                                </p>
                                                <p className="text-[10px] text-gray-500 truncate max-w-[140px]">
                                                    {item.viewer_city},{" "}
                                                    {item.viewer_country}
                                                </p>
                                            </div>
                                            <Heart
                                                size={15}
                                                color="#6367FF"
                                                className="cursor-pointer hover:scale-110 transition-transform"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLikeToggle(
                                                        item.viewer_username,
                                                        item.is_liked,
                                                        "viewers",
                                                    );
                                                }}
                                                fill={
                                                    item.is_liked ||
                                                    item.is_match
                                                        ? "#6367FF"
                                                        : "transparent"
                                                }
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
                                    <UserRound size={64} />
                                    <p className="mt-4 font-bold">
                                        No viewers yet
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "liked" && (
                        <div className="w-full h-full p-2 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start">
                            {likers.length > 0 ? (
                                likers.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-2 bg-[#F5F3FF] p-2 rounded-xl shadow-lg hover:translate-y-[-4px] transition-transform cursor-pointer"
                                        onClick={() =>
                                            router.push(
                                                `/profile/${item.liker_username}`,
                                            )
                                        }
                                    >
                                        <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                                            <Image
                                                src={formatAvatar(
                                                    item.liker_avatar,
                                                )}
                                                alt="Liker"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                            {item.is_match && (
                                                <div className="absolute top-2 right-2 bg-[#E2DCFF]/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                                                    <p className="text-[8px] text-[#555EFF] font-semibold tracking-wider">
                                                        Matching
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex w-full justify-between items-center">
                                            <div className="p-1">
                                                <p className="text-xs text-gray-900 font-bold truncate">
                                                    {item.liker_first_name},{" "}
                                                    {item.liker_age}
                                                </p>
                                                <p className="text-[10px] text-gray-500 truncate max-w-[140px]">
                                                    {item.liker_city},{" "}
                                                    {item.liker_country}
                                                </p>
                                            </div>
                                            <Heart
                                                size={15}
                                                color="#6367FF"
                                                className="cursor-pointer hover:scale-110 transition-transform"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLikeToggle(
                                                        item.liker_username,
                                                        item.is_liked,
                                                        "likers",
                                                    );
                                                }}
                                                fill={
                                                    item.is_liked ||
                                                    item.is_match
                                                        ? "#6367FF"
                                                        : "transparent"
                                                }
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
                                    <HandHeart size={64} />
                                    <p className="mt-4 font-bold">
                                        No likes yet
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Expandable Image Modal for My Profile */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-100 flex justify-center items-center bg-black/85 backdrop-blur-md p-4 cursor-zoom-out"
                    onClick={() => setExpandedImage(null)}
                >
                    <div className="relative w-full max-w-4xl max-h-[90vh] flex justify-center items-center">
                        <button
                            className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white p-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedImage(null);
                            }}
                        >
                            <X size={32} strokeWidth={2.5} />
                        </button>
                        <Image
                            src={formatAvatar(expandedImage)}
                            alt="Expanded"
                            width={800}
                            height={800}
                            className="object-contain max-h-[80vh] rounded-xl shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                            unoptimized
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
