"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    MapPin,
    Heart,
    Flag,
    Shield,
    ShieldBan,
    MoreHorizontal,
    X,
    MessageCircleMore,
    GalleryHorizontalEnd,
    GalleryVertical,
} from "lucide-react";
import { INTERESTS } from "@/core/constants/interests";
import rating from "@/core/types/Rating";
import { ApiProfile } from "@/core/types/profiles";

export default function OtherProfileView({
    profileData,
    isLiked,
    setIsLiked,
    isMatch,
    setIsMatch,
    onMatch,
}: {
    profileData: ApiProfile;
    isLiked: boolean;
    setIsLiked: (v: boolean) => void;
    isMatch: boolean;
    setIsMatch: (v: boolean) => void;
    onMatch: (u: ApiProfile) => void;
}) {
    const [block, setBlock] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReasons, setReportReasons] = useState<string[]>([]);
    const [expandedImage, setExpandedImage] = useState<any>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleBlockUser = async () => {
        const newBlockState = !block;
        setBlock(newBlockState);
        try {
            const action = newBlockState ? "block" : "unblock";
            const res = await fetch(
                `http://localhost:5001/api/v1/profile/${profileData.username}/${action}`,
                { method: "POST", credentials: "include" },
            );
            if (res.ok) {
                const json = await res.json();
                if (json.data?.is_blocked) {
                    setBlock(true);
                    onMatch(profileData);
                } else if (!newBlockState) {
                    setBlock(false);
                }
            }
        } catch (err) {
            setBlock(!newBlockState);
        }
    };

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

    const formatAvatar = (url: string | null | undefined) => {
        if (!url) return "";
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

    const renderRating = (userRating: string) => {
        const ratingObj =
            rating.find((r) => r.name.includes(userRating)) || rating[0];
        return <span style={{ color: ratingObj.color }}>{ratingObj.name}</span>;
    };

    return (
        <div className="w-full h-fit md:h-full flex flex-col p-4">
            <div className="w-full h-full flex flex-col items-center bg-[#F5F3FF] rounded-4xl shadow-xl ">
                <div className="relative flex w-full h-fit flex-col lg:flex-row items-center lg:items-stretch gap-5 shrink-0 p-4 px-5 ">
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
                                    onClick={handleBlockUser}
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
                                .map((item, index: number) => (
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
            {/* <div className="py-6">e</div> */}

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
