"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import logoMini from "@/public/logo-mini.svg";
import girl from "@/public/girl1.png";
import {
    HouseHeart,
    User,
    MessageCircle,
    Settings,
    BellDot,
    Search,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { name: "Home", href: "/home", icon: HouseHeart },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "Advanced Search", href: "/advance-search", icon: Search },
    { name: "Notifications", href: "/notifications", icon: BellDot },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        let isMobile = window.innerWidth < 768;
        setIsMinimized(isMobile);

        const handleResize = () => {
            const currentIsMobile = window.innerWidth < 768;
            if (currentIsMobile !== isMobile) {
                isMobile = currentIsMobile;
                setIsMinimized(isMobile);
            }
            if (!currentIsMobile) {
                setIsMobileMenuOpen(false); // Close mobile menu if expanding screen
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className={`relative bg-transparent md:bg-[#E9E8FF] md:shadow-xl shadow-black/20 transition-all duration-300 
            flex flex-row items-center justify-between w-full rounded-2xl md:rounded-3xl md:p-4
            md:flex-col md:max-h-[900px] md:py-5 md:px-4 md:justify-between z-40
            ${
                isMinimized
                    ? "md:w-[90px] md:gap-6 md:rounded-2xl"
                    : "md:min-w-[250px] lg:min-w-[280px] md:gap-5 md:rounded-2xl"
            }`}
        >
            <div className="flex flex-row justify-between items-center w-full md:justify-center">
                {/* Logo Area */}
                <div
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center justify-center md:w-full"
                    title={isMinimized ? "Expand Menu" : "Collapse Menu"}
                >
                    {/* Desktop Logo logic */}
                    <div className="hidden md:block">
                        {isMinimized ? (
                            <Image
                                src={logoMini}
                                alt="Logo Mini"
                                width={45}
                                height={45}
                            />
                        ) : (
                            <Image
                                src={logo}
                                alt="Logo"
                                width={180}
                                height={180}
                            />
                        )}
                    </div>
                    {/* Mobile Logo logic */}
                    <div className="block md:hidden">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={140}
                            height={140}
                            className="max-w-[140px]"
                        />
                    </div>
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X
                                size={32}
                                className="text-[#6367FF] cursor-pointer"
                            />
                        ) : (
                            <Menu
                                size={32}
                                className="text-[#6367FF] cursor-pointer"
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl p-4 flex flex-col gap-2 z-50 animate-in fade-in slide-in-from-top-4 border-2 border-[#E9E8FF]">
                    <div className="flex items-center gap-3 mb-4 p-2 border-b pb-4">
                        <Image
                            src={girl}
                            alt="Profile"
                            width={50}
                            height={50}
                            className="rounded-full aspect-square object-cover"
                        />
                        <div className="flex flex-col">
                            <h2 className="font-bold text-gray-900">
                                Roger Geidt
                            </h2>
                            <p className="text-xs text-[#3B82F6] font-bold mt-1">
                                💎 Elite
                            </p>
                        </div>
                    </div>
                    {NAV_ITEMS.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            pathname?.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex flex-row items-center rounded-xl p-3 transition-colors duration-200 cursor-pointer gap-4 ${
                                    isActive
                                        ? "bg-[#DFD8FF] text-[#555EFF]"
                                        : "hover:bg-[#DFD8FF] hover:text-[#555EFF] text-gray-700"
                                }`}
                            >
                                <item.icon size={20} className="shrink-0" />
                                <p className="text-sm font-medium">
                                    {item.name}
                                </p>
                            </Link>
                        );
                    })}
                    <Link
                        href="/login"
                        className="flex flex-row items-center rounded-xl p-3 bg-[#b800002d] text-[#b80000] hover:bg-[#b800004d] transition-colors duration-200 cursor-pointer mt-2 gap-4"
                    >
                        <LogOut size={20} className="shrink-0" />
                        <p className="text-sm font-medium">Logout</p>
                    </Link>
                </div>
            )}

            {/* Profile Section - Desktop only */}
            {!isMinimized && (
                <div className="hidden md:flex flex-col gap-2 items-center justify-center animate-in fade-in zoom-in duration-300">
                    <Image
                        src={girl}
                        alt="Girl"
                        width={140}
                        height={140}
                        className="rounded-4xl border-4 border-white aspect-square object-cover"
                    />
                    <div className="flex flex-col gap-1 items-center">
                        <h2 className="text-lg font-bold text-center">
                            Roger Geidt
                        </h2>
                        <p className="text-xs">
                            Popularity:{" "}
                            <span className="font-bold text-[#3B82F6]">
                                💎 Elite
                            </span>
                        </p>
                    </div>
                </div>
            )}

            {/* Desktop Nav Items */}
            <div
                className={`hidden md:flex w-full flex-1 flex-col gap-4 ${isMinimized ? "items-center" : ""}`}
            >
                {NAV_ITEMS.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        pathname?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={isMinimized ? item.name : undefined}
                            className={`flex flex-row items-center rounded-xl p-2 transition-colors duration-200 cursor-pointer ${
                                isMinimized
                                    ? "justify-center w-10 h-10"
                                    : "gap-4"
                            } ${
                                isActive
                                    ? "bg-[#DFD8FF] text-[#555EFF]"
                                    : "hover:bg-[#DFD8FF] hover:text-[#555EFF] text-gray-700"
                            }`}
                        >
                            <item.icon size={20} className="shrink-0" />
                            {!isMinimized && (
                                <p className="text-xs font-medium whitespace-nowrap animate-in fade-in duration-500">
                                    {item.name}
                                </p>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Desktop Logout */}
            <Link
                href="/login"
                title={isMinimized ? "Logout" : undefined}
                className={`hidden md:flex flex-row items-center rounded-xl p-2 bg-[#b800002d] text-[#b80000] hover:bg-[#b800004d] transition-colors duration-200 cursor-pointer mt-2 ${
                    isMinimized ? "justify-center w-10 h-10" : "gap-4 w-full"
                }`}
            >
                <LogOut size={20} className="shrink-0" />
                {!isMinimized && (
                    <p className="text-xs font-medium whitespace-nowrap animate-in fade-in duration-500">
                        Logout
                    </p>
                )}
            </Link>
        </div>
    );
}
