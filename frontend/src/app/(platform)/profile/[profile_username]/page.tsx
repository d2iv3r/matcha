"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
    MapPin,
    GalleryVertical,
    UserRound,
    HandHeart,
    Heart,
    GalleryHorizontalEnd,
    Flag,
    Shield,
    ShieldBan,
    MoreHorizontal,
    X,
    MessageCircleMore,
} from "lucide-react";
import { useProfile } from "@/core/contexts/ProfileContext";
import MatchOverlay from "@/core/components/MatchOverlay";
import { INTERESTS } from "@/core/constants/interests";
import girl from "@/public/girl1.png";

// --- Sub-components ---

function MyProfileView({
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
                    list.map((item) => {
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
    console.log("viewers", viewers);
    console.log("likers", likers);

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
        <div className="w-full h-full gap-4 flex flex-col items-center bg-[#F5F3FF] rounded-4xl shadow-xl p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                    {["gallery", "viewers", "liked"].map((tab) => (
                        <div
                            key={tab}
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
                                                    <p className="text-[8px] text-[#555EFF] font-bold uppercase tracking-wider">
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
                                                <p className="text-[10px] text-gray-500 truncate">
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
                                                <p className="text-[10px] text-gray-500 truncate">
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

function OtherProfileView({
    profileData,
    isLiked,
    setIsLiked,
    isMatch,
    setIsMatch,
    onMatch,
}: any) {
    const [block, setBlock] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReasons, setReportReasons] = useState<string[]>([]);
    const [expandedImage, setExpandedImage] = useState<any>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const toggleLike = async () => {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        try {
            const action = newLikedState ? "like" : "unlike";
            const res = await fetch(
                `http://localhost:5001/api/v1/profile/${profileData.username}/${action}`,
                { method: "POST", credentials: "include" },
            );
            if (res.ok) {
                const json = await res.json();
                if (json.data?.is_match) {
                    setIsMatch(true);
                    onMatch(profileData);
                } else if (!newLikedState) {
                    setIsMatch(false);
                }
            }
        } catch (err) {
            setIsLiked(!newLikedState);
        }
    };

    const toggleReason = (reason: string) => {
        setReportReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason],
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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node))
                setShowMenu(false);
        };
        if (showMenu)
            document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    const renderRating = (rating: string) => {
        const ratingMap: Record<string, { label: string; color: string }> = {
            Ghost: { label: "👻 Ghost", color: "#94A3B8" },
            Rising: { label: "📈 Rising", color: "#34D399" },
            Popular: { label: "🔥 Popular", color: "#FB923C" },
            Elite: { label: "💎 Elite", color: "#3B82F6" },
            Iconic: { label: "👑 Iconic", color: "#A855F7" },
        };
        const style = ratingMap[rating] || ratingMap.Ghost;
        return <span style={{ color: style.color }}>{style.label}</span>;
    };

    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="w-full h-full flex flex-col items-center bg-[#F5F3FF] rounded-4xl shadow-xl">
                <div className="relative flex w-full h-fit flex-col lg:flex-row items-center lg:items-stretch gap-5 shrink-0 p-4 px-5">
                    <div className="relative w-[180px] h-[180px] md:h-[220px] shrink-0">
                        <Image
                            src={formatAvatar(profileData.avatar)}
                            alt="Profile"
                            fill
                            unoptimized
                            className="rounded-[24px] object-cover shadow-lg"
                        />
                        <div className="absolute bottom-0 w-full h-1/2 bg-linear-to-t from-[#555DFF] to-transparent rounded-b-2xl"></div>
                        <div className="absolute flex flex-col gap-2 bottom-3 left-3">
                            {isMatch && (
                                <div
                                    className="flex gap-2 items-center cursor-pointer"
                                    onClick={() =>
                                        router.push(
                                            `/chat?user=${profileData.username}`,
                                        )
                                    }
                                >
                                    <MessageCircleMore
                                        size={20}
                                        className="text-white"
                                    />
                                    <p className="text-xs text-white font-medium">
                                        Message
                                    </p>
                                </div>
                            )}
                            <div
                                className="flex gap-2 items-center cursor-pointer"
                                onClick={toggleLike}
                            >
                                <Heart
                                    size={20}
                                    className="text-white transition-colors"
                                    fill={isLiked ? "white" : "transparent"}
                                />
                                <p className="text-xs text-white font-medium">
                                    {isLiked ? "Unlike" : "Like"}
                                </p>
                            </div>
                        </div>
                        {isMatch && (
                            <div className="absolute flex flex-col bg-[#E2DCFF] px-4 py-2 rounded-xl top-3 right-3">
                                <p className="text-[8px] text-[#555EFF] font-semibold tracking-wider">
                                    Matching
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col w-full h-full flex-1 min-w-0 md:justify-between items-center lg:items-start py-1 gap-3">
                        <div className="flex flex-col gap-1 items-center md:items-start">
                            <h4 className="text-xs text-gray-900">
                                @{profileData.username}
                            </h4>
                            <h2 className="font-bold text-gray-900">
                                {profileData.first_name}{" "}
                                {profileData.last_name || ""}
                                {", "}
                                <span className="text-gray-500">
                                    {profileData.age}
                                </span>
                            </h2>
                            <div className="flex flex-row items-center gap-1 text-gray-500">
                                <MapPin size={15} className="" />
                                <p className="text-xs font-medium">
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
                        <div className="flex flex-row gap-2 flex-wrap w-full md:max-w-[700px] justify-center md:justify-start items-center md:items-start">
                            {Array.isArray(profileData.interests) &&
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
                                            {foundInterest?.icon || (
                                                <span className="font-bold text-[10px] leading-none">
                                                    #
                                                </span>
                                            )}
                                            <span className="font-semibold text-[10px] text-[#4B4B4B]">
                                                {foundInterest?.label || tagId}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div
                        ref={menuRef}
                        className="p-4 self-end md:self-start z-30 absolute top-0 right-0"
                    >
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 text-gray-500 hover:bg-[#E2DCFF] hover:text-[#6367FF] rounded-xl transition-colors cursor-pointer"
                        >
                            <MoreHorizontal size={24} />
                        </button>
                        {showMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 flex flex-col w-40">
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        setShowReportModal(true);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-50 transition-colors text-sm font-medium w-full text-left cursor-pointer"
                                >
                                    <Flag size={16} /> <span>Report</span>
                                </button>
                                <button
                                    onClick={() => setBlock(!block)}
                                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-50 transition-colors text-sm font-medium w-full text-left border-t border-gray-50 cursor-pointer"
                                >
                                    {block ? (
                                        <ShieldBan size={16} />
                                    ) : (
                                        <Shield size={16} />
                                    )}
                                    <span>{block ? "Unblock" : "Block"}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col w-full h-full flex-2">
                    <div className="ml-5 px-2 flex w-fit gap-2 border-b-3 pb-2 border-[#555DFF] justify-center items-center">
                        <GalleryHorizontalEnd
                            size={20}
                            className="text-[#555DFF]"
                        />
                        <p className="text-[#555DFF] font-semibold">Gallery</p>
                    </div>
                    <div className="w-full h-full p-4 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-[#E9E8FF] rounded-b-4xl min-h-[300px]">
                        {(Array.isArray(profileData.pictures) &&
                            profileData.pictures.length > 0) ||
                        profileData.avatar ? (
                            [
                                profileData.avatar,
                                ...(Array.isArray(profileData.pictures)
                                    ? profileData.pictures
                                    : []),
                            ]
                                .filter(Boolean)
                                .map((item: string, index: number) => (
                                    <Image
                                        key={index}
                                        src={formatAvatar(item)}
                                        alt={`Gallery image ${index + 1}`}
                                        width={180}
                                        height={280}
                                        unoptimized
                                        onClick={() => setExpandedImage(item)}
                                        className="rounded-2xl object-cover w-full aspect-3/4 shadow-sm cursor-zoom-in hover:brightness-95 transition-all duration-300"
                                    />
                                ))
                        ) : (
                            <div className="col-span-full py-20 text-center opacity-40">
                                <GalleryVertical className="mx-auto mb-2" /> No
                                photos shared yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showReportModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 ">
                    <div className="bg-[#EAE8FC] w-[600px] max-w-[90vw] rounded-[32px] p-6 shadow-2xl relative">
                        <button
                            onClick={() => setShowReportModal(false)}
                            className="absolute top-6 right-6 text-black hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                        >
                            <X size={24} strokeWidth={2.5} />
                        </button>
                        <h2 className="text-base font-bold text-gray-900 mb-6">
                            Report {profileData.first_name}
                        </h2>
                        <p className="text-gray-700 mb-8 text-md">
                            Why did you report this user ?
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-12 pl-1">
                            {[
                                "Harassment",
                                "Threats",
                                "Inappropriate Content",
                                "Catfishing",
                                "Violation of Terms",
                                "Unwanted Advances",
                                "Offensive Language",
                                "Unsolicited Explicit Content",
                                "Disrespectful Behavior",
                                "Privacy Concerns",
                            ].map((reason) => (
                                <label
                                    key={reason}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <input
                                        type="checkbox"
                                        checked={reportReasons.includes(reason)}
                                        onChange={() => toggleReason(reason)}
                                        className="w-3 h-3 rounded text-[#6367FF] border-[#6367FF] focus:ring-[#6367FF] accent-[#6367FF] cursor-pointer"
                                    />
                                    <span className="text-gray-900 tracking-tight text-xs group-hover:text-black transition-colors">
                                        {reason}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 mt-auto">
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="px-6 py-2 text-xs bg-[#DFDBFE] text-[#555DFF] font-semibold tracking-wide rounded-lg hover:bg-[#D5CEFF] transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="px-6 py-2 text-xs bg-[#424AB5] text-white font-semibold tracking-wide rounded-lg hover:bg-[#343999] transition-colors cursor-pointer"
                            >
                                Send Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            src={
                                expandedImage.startsWith("/")
                                    ? `http://localhost:5001${expandedImage}`
                                    : expandedImage
                            }
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

// --- Main Page Component ---

export default function UnifiedProfilePage() {
    const { profile_username } = useParams();
    const { profile: myProfile, isLoading: isMyProfileLoading } = useProfile();

    // UI state
    const [activeTab, setActiveTab] = useState<"gallery" | "viewers" | "liked">(
        "gallery",
    );
    const [profileData, setProfileData] = useState<any>(null);
    const [viewers, setViewers] = useState<any[]>([]);
    const [likers, setLikers] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isMatch, setIsMatch] = useState(false);
    const [matchModal, setMatchModal] = useState<{
        isOpen: boolean;
        user: any | null;
    }>({
        isOpen: false,
        user: null,
    });
    const router = useRouter();

    const isOwner = myProfile?.profile?.username === profile_username;

    const hasFetched = useRef(false);

    // Main profile fetch
    useEffect(() => {
        if (!profile_username || isMyProfileLoading) return;
        if (hasFetched.current) return;

        if (isOwner && myProfile) {
            setProfileData(myProfile.profile);
            setIsFetching(false);
            hasFetched.current = true;
        } else if (!isOwner) {
            setIsFetching(true);
            hasFetched.current = true;
            fetch(
                `http://localhost:5001/api/v1/accounts/profile/${profile_username}`,
                { credentials: "include" },
            )
                .then((res) => {
                    if (!res.ok) throw new Error("Fetch failed");
                    return res.json();
                })
                .then((result) => {
                    if (result.success) {
                        setProfileData(result.data.profile);
                        setIsLiked(
                            result.data.is_liked || result.data.is_match,
                        );
                        setIsMatch(result.data.is_match);
                    } else {
                        setProfileData(null);
                    }
                })
                .catch((err) => {
                    console.error("Profile fetch error:", err);
                    setProfileData(null);
                    hasFetched.current = false; // Allow retry on error
                })
                .finally(() => setIsFetching(false));
        }
    }, [profile_username, isOwner, myProfile, isMyProfileLoading]);

    // Owner specific tabs fetch
    useEffect(() => {
        if (!isOwner) return;

        if (activeTab === "viewers") {
            setIsFetching(true);
            fetch("http://localhost:5001/api/v1/profile/viewers", {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.success) setViewers(result.data.viewers || []);
                })
                .finally(() => setIsFetching(false));
        } else if (activeTab === "liked") {
            setIsFetching(true);
            fetch("http://localhost:5001/api/v1/profile/likes", {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.success) setLikers(result.data.likers || []);
                })
                .finally(() => setIsFetching(false));
        }
    }, [activeTab, isOwner]);

    if (isFetching && !profileData) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6367FF]"></div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500 font-medium">Profile not found</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-4 overflow-hidden">
            {!isOwner && profileData ? (
                <OtherProfileView
                    profileData={profileData}
                    isLiked={isLiked}
                    setIsLiked={setIsLiked}
                    isMatch={isMatch}
                    setIsMatch={setIsMatch}
                    onMatch={(u: any) =>
                        setMatchModal({ isOpen: true, user: u })
                    }
                />
            ) : (
                <MyProfileView
                    profileData={profileData}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    viewers={viewers}
                    setViewers={setViewers}
                    likers={likers}
                    setLikers={setLikers}
                    onMatch={(u: any) =>
                        setMatchModal({ isOpen: true, user: u })
                    }
                />
            )}

            <MatchOverlay
                isOpen={matchModal.isOpen}
                onClose={() => setMatchModal({ isOpen: false, user: null })}
                myAvatar={myProfile?.profile?.avatar || null}
                matchAvatar={matchModal.user?.avatar || null}
                matchName={
                    matchModal.user?.first_name ||
                    matchModal.user?.username ||
                    ""
                }
                onChat={() => {
                    setMatchModal({ isOpen: false, user: null });
                    router.push("/chat");
                }}
            />
        </div>
    );
}
