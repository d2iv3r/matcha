"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import girl from "@/public/girl1.png";
import {
    MapPin,
    Coffee,
    Gamepad2,
    Plane,
    Tv,
    Music,
    GalleryHorizontalEnd,
    Flag,
    Shield,
    ShieldBan,
    MoreHorizontal,
    Heart,
    X,
    MessageCircleMore,
} from "lucide-react";

const profileData = [
    { image: girl },
    { image: girl },
    { image: girl },
    { image: girl },
    { image: girl },
];

const PROFILE_TAGS = [
    { label: "Coffee", icon: <Coffee size={16} /> },
    { label: "Gaming", icon: <Gamepad2 size={16} /> },
    { label: "Travel", icon: <Plane size={16} /> },
    { label: "Anime", icon: <Tv size={16} /> },
    { label: "Music", icon: <Music size={16} /> },
];

export default function OtherProfilePage() {
    const [block, setBlock] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReasons, setReportReasons] = useState<string[]>([]);
    const [expandedImage, setExpandedImage] = useState<any>(null);
    const [isLiked, setIsLiked] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    const toggleReason = (reason: string) => {
        setReportReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason],
        );
    };

    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="w-full h-full gap-4 flex flex-col items-center bg-[#F5F3FF] rounded-4xl shadow-xl">
                <div className="relative flex w-full h-fit flex-col lg:flex-row items-center lg:items-stretch gap-5 shrink-0 p-4 px-5">
                    <div className="relative">
                        <Image
                            src={girl}
                            alt="Profile"
                            width={180}
                            height={400}
                            className="rounded-[24px] aspect-4.5/5 object-cover shadow-lg shrink-0"
                        />
                        <div className="absolute bottom-0 w-full h-1/2 bg-linear-to-t from-[#555DFF] to-transparent rounded-b-2xl"></div>
                        <div className="absolute flex flex-col gap-2 bottom-3 left-3">
                            {isLiked && (
                                <div className="flex gap-2 items-center cursor-pointer">
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
                                onClick={() => setIsLiked(!isLiked)}
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
                        {isLiked && (
                            <div className="absolute flex flex-col bg-[#E2DCFF] px-4 py-2 rounded-xl top-3 right-3">
                                <p className="text-xs text-[#555EFF] font-medium">
                                    Matching
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col w-full h-full flex-1 min-w-0 md:justify-between items-center lg:items-start py-1 gap-3">
                        <div className="flex flex-col gap-1 items-center md:items-start">
                            <h4 className="text-xs text-gray-900">
                                @rogergeidt
                            </h4>
                            <h2 className="font-bold text-gray-900">
                                Roger Geidt{" "}
                                <span className="text-gray-500">24</span>
                            </h2>
                            <div className="flex flex-row items-center gap-1 text-gray-500">
                                <MapPin size={15} className="" />
                                <p className="text-xs font-medium">
                                    Germany, Berlin
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-900 font-medium">
                            popularity:{" "}
                            <span className="text-[#3B82F6]">💎 Elite</span>
                        </p>
                        <p className="text-xs text-gray-900 max-w-[460px] text-center md:text-start">
                            Good vibes, good food, and good conversations. I
                            enjoy discovering new places, late-night talks, and
                            laughing about random things.
                        </p>
                        <div className="flex flex-row gap-2 flex-wrap w-full md:max-w-[700px] justify-center md:justify-start items-center md:items-start">
                            {PROFILE_TAGS.map((tag) => (
                                <div
                                    key={tag.label}
                                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#E2DCFF] text-[#6367FF]"
                                >
                                    {tag.icon}
                                    <span className="font-medium text-xs text-[#4B4B4B]">
                                        {tag.label}
                                    </span>
                                </div>
                            ))}
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
                                    <Flag size={16} />
                                    <span>Report</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setBlock(!block);
                                    }}
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
                    <div className="w-full h-full mt-1 p-4 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-[#E9E8FF] rounded-b-4xl">
                        {profileData.map((item, index) => (
                            <Image
                                key={index}
                                src={item.image}
                                alt={`Gallery image ${index + 1}`}
                                width={180}
                                height={250}
                                onClick={() => setExpandedImage(item.image)}
                                className="rounded-2xl object-cover w-full h-auto shadow-sm cursor-zoom-in hover:brightness-95 transition-all duration-300"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {showReportModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 ">
                    <div className="bg-[#EAE8FC] w-[600px] max-w-[90vw] rounded-[32px] p-6 shadow-2xl relative slide-in animate-in fade-in duration-300">
                        <button
                            onClick={() => setShowReportModal(false)}
                            className="absolute top-6 right-6 text-black hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                        >
                            <X size={24} strokeWidth={2.5} />
                        </button>

                        <h2 className="text-base font-bold text-gray-900 mb-6">
                            Report Alena
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
                                        name="report-reason"
                                        value={reason}
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

            {/* Lightbox / Expanded Image Modal */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-100 flex justify-center items-center bg-black/85 backdrop-blur-mkd p-4 cursor-zoom-out animate-in fade-in duration-200"
                    onClick={() => setExpandedImage(null)}
                >
                    <div className="relative w-full max-w-4xl max-h-[90vh] flex justify-center items-center slide-in-from-bottom-4 animate-in duration-300">
                        <button
                            className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white p-2 rounded-full transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedImage(null);
                            }}
                        >
                            <X size={32} strokeWidth={2.5} />
                        </button>
                        <Image
                            src={expandedImage}
                            alt="Expanded Profile Image"
                            width={800}
                            height={800}
                            className="object-contain w-[80vw] lg:w-auto lg:h-[80vh] rounded-xl shadow-xl cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
