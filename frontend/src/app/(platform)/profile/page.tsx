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
    GalleryVertical,
    UserRound,
    HandHeart,
    Heart,
} from "lucide-react";

const profileData = [
    { image: girl },
    { image: girl },
    { image: girl },
    { image: girl },
    { image: girl },
];
const profile_viewers = [
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: false,
        image: "/girl1.png",
    },
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: false,
        image: "/girl1.png",
    },
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: true,
        image: "/girl1.png",
    },
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: false,
        image: "/girl1.png",
    },
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: false,
        image: "/girl1.png",
    },
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: false,
        image: "/girl1.png",
    },
];
const profile_liked = [
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: true,
        image: "/girl1.png",
    },
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: true,
        image: "/girl1.png",
    },
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: true,
        image: "/girl1.png",
    },
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: true,
        image: "/girl1.png",
    },
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: true,
        image: "/girl1.png",
    },
    {
        name: "Emily",
        age: 20,
        city: "Los Angeles",
        country: "USA",
        matching: true,
        image: "/girl1.png",
    },
];

const PROFILE_TAGS = [
    { label: "Coffee", icon: <Coffee size={16} /> },
    { label: "Gaming", icon: <Gamepad2 size={16} /> },
    { label: "Travel", icon: <Plane size={16} /> },
    { label: "Anime", icon: <Tv size={16} /> },
    { label: "Music", icon: <Music size={16} /> },
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"gallery" | "viewers" | "liked">(
        "gallery",
    );
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
                        src={girl}
                        alt="Profile"
                        width={180}
                        height={360}
                        className="rounded-xl aspect-square md:aspect-4.5/5 object-cover"
                    />
                    <div className="flex flex-col w-full h-full flex-1 min-w-0 md:justify-between items-center md:items-start py-1 gap-2">
                        <div className="flex flex-col gap-3 items-center md:items-start">
                            <div className="flex flex-col gap-1 items-center md:items-start">
                                <h4 className="text-xs text-gray-900">
                                    @rogergeidt
                                </h4>
                                <h2 className="font-bold text-gray-900">
                                    Roger Geidt{" "}
                                    <span className="font-medium">24</span>
                                </h2>
                                <div className="flex flex-row items-center gap-1">
                                    <MapPin
                                        size={15}
                                        className="text-gray-500"
                                    />
                                    <p className="text-xs text-gray-500 font-medium">
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
                                enjoy discovering new places, late-night talks,
                                and laughing about random things.
                            </p>
                        </div>
                        <div className="flex flex-row gap-2 flex-wrap w-full md:max-w-[700px] justify-center md:justify-start items-center md:items-start">
                            {PROFILE_TAGS.map((tag) => (
                                <div
                                    key={tag.label}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E2DCFF] text-[#6367FF]"
                                >
                                    {tag.icon}
                                    <span className="font-medium text-xs text-[#4B4B4B]">
                                        {tag.label}
                                    </span>
                                </div>
                            ))}
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
                                    className="md:size-4"
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
                                <UserRound size={15} className="md:size-4" />
                                <p>Profile Viewers</p>
                            </div>
                            <div
                                ref={(el) => {
                                    tabsRef.current["liked"] = el;
                                }}
                                onClick={() => setActiveTab("liked")}
                                className={`relative z-10 p-2 flex gap-2 items-center flex-col md:flex-row px-2 md:px-4 py-2 rounded-xl cursor-pointer text-xs transition-colors duration-300 ${activeTab === "liked" ? "text-[#6552FF]" : "hover:bg-[#DFD9FF] text-black"}`}
                            >
                                <HandHeart size={15} className="md:size-4" />
                                <p>Liked Profiles</p>
                            </div>
                        </div>
                    </div>
                    {activeTab === "gallery" && (
                        <div className="w-full h-full p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {profileData.map((item, index) => (
                                <Image
                                    key={index}
                                    src={item.image}
                                    alt="Profile"
                                    width={180}
                                    height={250}
                                    className="rounded-xl object-cover w-full h-auto"
                                />
                            ))}
                        </div>
                    )}
                    {activeTab === "viewers" && (
                        <div className="w-full h-full p-2 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {profile_viewers.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-2 bg-[#F5F3FF] p-2 rounded-xl shadow-lg"
                                >
                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden group/image shrink-0">
                                        <Image
                                            src={item.image}
                                            alt="Profile"
                                            width={180}
                                            height={160}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover/image:scale-110"
                                        />
                                        <div className="absolute z-10 top-0 left-0 w-full flex justify-end items-start p-2 pointer-events-none">
                                            {item.matching && (
                                                <div className="bg-[#DFD8FF]/90 backdrop-blur-[2px] px-2 py-1 md:px-3 md:py-1.5 rounded-lg flex justify-center items-center shadow-sm pointer-events-auto">
                                                    <p className="text-[10px] text-[#6367FF] font-semibold tracking-wide">
                                                        Matching
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 justify-between items-center px-1">
                                        <div className="flex gap-1 flex-col justify-center">
                                            <p className="text-xs text-gray-900 font-bold">
                                                {item.age}, {item.name}
                                            </p>
                                            <p className="text-xs text-gray-900">
                                                {item.country}, {item.city}
                                            </p>
                                        </div>
                                        <div className="relative group flex items-center justify-center">
                                            <Heart
                                                color="#6367FF"
                                                fill={
                                                    item.matching || isLiked
                                                        ? "#6367FF"
                                                        : "none"
                                                }
                                                className="cursor-pointer transition-transform group-hover:scale-110 active:scale-95 shrink-0"
                                                size={25}
                                                onClick={() =>
                                                    setIsLiked(!isLiked)
                                                }
                                            />
                                            <div className="absolute bottom-[calc(100%+8px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-50 flex flex-col items-center">
                                                {item.matching || isLiked
                                                    ? "Unlike"
                                                    : "Like"}
                                                <div className="absolute -bottom-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === "liked" && (
                        <div className="w-full h-full p-2 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start overflow-y-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {profile_liked.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-2 bg-[#F5F3FF] p-2 rounded-xl shadow-lg"
                                >
                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden group/image shrink-0">
                                        <Image
                                            src={item.image}
                                            alt="Profile"
                                            width={180}
                                            height={160}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover/image:scale-110"
                                        />
                                        <div className="absolute z-10 top-0 left-0 w-full flex justify-end items-start p-2 pointer-events-none">
                                            {item.matching && (
                                                <div className="bg-[#DFD8FF]/90 backdrop-blur-[2px] px-2 py-1 md:px-3 md:py-1.5 rounded-lg flex justify-center items-center shadow-sm pointer-events-auto">
                                                    <p className="text-[10px] text-[#6367FF] font-medium tracking-wide">
                                                        Matching
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 justify-between items-center px-1">
                                        <div className="flex gap-1 flex-col justify-center">
                                            <p className="text-xs text-gray-900 font-bold">
                                                {item.age}, {item.name}
                                            </p>
                                            <p className="text-xs text-gray-900">
                                                {item.country}, {item.city}
                                            </p>
                                        </div>
                                        <div className="relative group flex items-center justify-center">
                                            <Heart
                                                className="text-[#6367FF] fill-[#6367FF] group-hover:fill-transparent cursor-pointer transition-all group-hover:scale-110 active:scale-95 shrink-0"
                                                size={25}
                                            />
                                            <div className="absolute bottom-[calc(100%+8px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-50 flex flex-col items-center">
                                                Unlike
                                                <div className="absolute -bottom-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
