"use client";

import {
    Search,
    MoreVertical,
    Shield,
    ShieldBan,
    Eye,
    Flag,
    X,
    Smile,
    Send,
} from "lucide-react";
import girl from "@/public/girl1.png";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const EMOJIS = [
    "😀",
    "😂",
    "🥰",
    "😎",
    "🥺",
    "😭",
    "😤",
    "😡",
    "👍",
    "🙏",
    "🔥",
    "✨",
    "❤️",
    "💯",
    "🎉",
    "👀",
    "🤔",
    "🙄",
    "🤫",
    "😘",
    "😜",
    "🤭",
    "🤤",
    "🥱",
];

const onlineprofiles = [
    { image: girl },
    { image: girl },
    { image: girl },
    { image: girl },
    { image: girl },
    { image: girl },
    { image: girl },
    { image: girl },
];

const chatmessage = [
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "Mon, 23:00",
        online: false,
        unread: 0,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?Hi, how are you?Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 4,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 10,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: false,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you?",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you? whaaattttt",
        time: " Thes,10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you? yes how",
        time: "10:00",
        online: true,
        unread: 2,
    },
    {
        image: girl,
        name: "Alena Saris",
        message: "Hi, how are you? i am good ",
        time: "14:30",
        online: true,
        unread: 2,
    },
];

export default function ChatPage() {
    const [showMenu, setShowMenu] = useState(false);
    const [block, setBlock] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReasons, setReportReasons] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);

    const toggleReason = (reason: string) => {
        setReportReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason],
        );
    };

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                emojiRef.current &&
                !emojiRef.current.contains(event.target as Node)
            ) {
                setShowEmojis(false);
            }
        };

        if (showEmojis) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojis]);

    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="w-full h-full flex flex-row bg-[#F5F3FF] rounded-4xl shadow-xl">
                <div className="flex flex-col gap-3 p-5 w-[30%]">
                    <h1 className="text-lg font-semibold">Now active</h1>
                    <div className="flex gap-2 bg-[#E9E8FF] p-1 rounded-lg items-center text-[#6367FF] mb-2">
                        <Search size={20} />
                        <input
                            type="search"
                            placeholder="Search..."
                            className="w-full bg-[#E9E8FF] outline-none text-[#6367FF]"
                        />
                    </div>
                    <div className="flex flex-row gap-2 w-full overflow-x-auto overflow-y-hidden max-w-full pb-2 shrink-0 scrollbar-hide">
                        {onlineprofiles.map((profile, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col gap-1 shrink-0"
                            >
                                <Image
                                    src={profile.image}
                                    alt="Profile"
                                    width={50}
                                    height={50}
                                    className="aspect-square rounded-full"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                        ))}
                    </div>
                    <hr className="border-[#C6BAFF]" />
                    <div className="overflow-x-hidden scrollbar-hide">
                        <div className="flex flex-col gap-3 w-full">
                            {chatmessage.map((chat, index) => (
                                <div
                                    key={index}
                                    className="w-full flex flex-row gap-2 items-center"
                                >
                                    <div className="relative">
                                        <Image
                                            src={chat.image}
                                            alt="Profile"
                                            width={50}
                                            height={50}
                                            className="aspect-square rounded-full"
                                        />
                                        {chat.online && (
                                            <div className="absolute bottom-1 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1 min-w-0 justify-between">
                                        <h3 className="text-xs font-bold truncate">
                                            {chat.name}
                                        </h3>
                                        <p className="text-[10px] text-gray-500 truncate">
                                            {chat.message}
                                        </p>
                                    </div>
                                    <div className="flex flex-col h-full gap-1 justify-between items-end">
                                        <p className="text-[10px] text-gray-500">
                                            {chat.time}
                                        </p>
                                        <div className="flex flex-col gap-1 h-5">
                                            {chat.unread > 0 && (
                                                <div className="flex flex-col gap-1 bg-[#6367FF] w-4 h-4 rounded-full justify-center items-center">
                                                    <p className="text-[10px] text-white">
                                                        {chat.unread > 9
                                                            ? "+9"
                                                            : chat.unread}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-px h-full bg-[#C6BAFF]" />
                <div className="w-[70%] flex flex-col">
                    <div className="relative flex flex-row gap-2 items-center p-5 justify-between">
                        <div className="flex gap-4 items-center">
                            <div className="relative">
                                <Image
                                    src={girl}
                                    alt="Profile"
                                    width={50}
                                    height={50}
                                    className="aspect-square rounded-full"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                            <h2 className="font-bold text-gray-900">
                                Alena Saris
                            </h2>
                        </div>
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 text-gray-500 hover:bg-[#E2DCFF] hover:text-[#6367FF] rounded-xl transition-colors cursor-pointer"
                            >
                                <MoreVertical size={24} />
                            </button>
                            {showMenu && (
                                <div className="absolute top-full right-0 mt-2d bg-white rounded-2xl shadow-xl overflow-hidden z-20 flex flex-col w-40">
                                    <button
                                        onClick={() => setShowMenu(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-[#6367FF] hover:bg-gray-50 transition-colors text-sm font-medium w-full text-left cursor-pointer"
                                    >
                                        <Eye size={16} />
                                        <span>View Profile</span>
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
                                        <span>
                                            {block ? "Unblock" : "Block"}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowReportModal(true);
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-50 transition-colors text-sm font-medium w-full text-left border-t border-gray-50 cursor-pointer"
                                    >
                                        <Flag size={16} />
                                        <span>Report</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <hr className="border-[#C6BAFF]" />
                    <div className="px-5 flex flex-col items-end justify-between gap-5 mb-5 h-full">
                        <div className="h-full flex flex-col items-end justify-end">
                            <div>dasc</div>
                            <div>dasc11</div>
                        </div>
                        <div className="flex w-full gap-4 items-center relative">
                            <div className="flex-1 flex h-12 items-center gap-3 bg-[#EAE8FC] px-5 rounded-xl">
                                <div
                                    className="relative flex items-center"
                                    ref={emojiRef}
                                >
                                    <button
                                        onClick={() =>
                                            setShowEmojis(!showEmojis)
                                        }
                                    >
                                        <Smile
                                            className="text-gray-500 cursor-pointer hover:text-[#6367FF] transition-colors"
                                            size={24}
                                        />
                                    </button>

                                    {showEmojis && (
                                        <div className="absolute bottom-full left-0 mb-6 bg-white rounded-2xl shadow-xl shadow-gray-400/30 border border-gray-100 p-3 grid grid-cols-6 gap-2 w-max z-50">
                                            <div className="absolute -bottom-2 left-3 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
                                            {EMOJIS.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    onClick={() =>
                                                        setMessage(
                                                            (prev) =>
                                                                prev + emoji,
                                                        )
                                                    }
                                                    className="text-xl hover:bg-gray-100 rounded-lg p-1.5 transition-colors cursor-pointer flex justify-center items-center"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Send message ..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-transparent outline-none text-[15px] text-gray-700 placeholder-gray-500 h-full"
                                />
                            </div>
                            <button className="bg-[#555DFF] w-12 h-12 rounded-xl text-white hover:bg-[#6367FF] transition-colors shadow-sm flex justify-center items-center cursor-pointer shrink-0">
                                <Send size={24} className="mr-1 mt-1" />
                            </button>
                        </div>
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
                        <p className="text-gray-700 mb-8 text-sm">
                            Why did you report this user ?
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-10 pl-1">
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
        </div>
    );
}
