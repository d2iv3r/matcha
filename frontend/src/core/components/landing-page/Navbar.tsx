"use client";

import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { Menu, X } from "lucide-react";

interface NavbarProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    handleScroll: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export default function Navbar({ isMenuOpen, setIsMenuOpen, handleScroll }: NavbarProps) {
    return (
        <nav className="relative w-full flex flex-row gap-4 items-center justify-between mt-5 z-50">
            <Image src={logo} alt="Logo" width={80} height={80} className="w-auto h-5" />

            {/* Desktop Links */}
            <div className="hidden lg:flex flex-1 flex-row gap-6 items-center justify-center text-white font-bold">
                <a
                    href="#hero"
                    onClick={(e) => handleScroll(e, "hero")}
                    className="text-md hover:text-[#FFDBFD] transition-colors"
                >
                    Home
                </a>
                <a
                    href="#about"
                    onClick={(e) => handleScroll(e, "about")}
                    className="text-md hover:text-[#FFDBFD] transition-colors"
                >
                    About
                </a>
                <a
                    href="#discover-brides"
                    onClick={(e) => handleScroll(e, "discover-brides")}
                    className="text-md hover:text-[#FFDBFD] transition-colors"
                >
                    Discover Brides
                </a>
                <a
                    href="#faq"
                    onClick={(e) => handleScroll(e, "faq")}
                    className="text-md hover:text-[#FFDBFD] transition-colors"
                >
                    FAQ
                </a>
            </div>
            <div className="hidden lg:flex flex-row gap-6 items-center justify-center font-bold text-[#2F2CD5]">
                <a href="/login" className="text-md transition-colors">
                    LOGIN
                </a>
                <a
                    href="/sign-up"
                    className="text-md underline underline-offset-2 transition-colors"
                >
                    SIGN UP
                </a>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden z-50">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-black bg-white/20 p-2 rounded-xl backdrop-blur-md transition-all active:scale-95"
                >
                    {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
                </button>
            </div>

            {/* Smooth Mobile Dropdown */}
            <div
                className={`absolute top-[120%] right-0 w-full md:w-[350px] bg-white rounded-3xl shadow-2xl flex flex-col p-6 gap-6 
                    transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-right
                    ${isMenuOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-4 invisible"}`}
            >
                <div className="flex flex-col gap-5 text-black font-bold text-lg">
                    <a
                        href="#hero"
                        onClick={(e) => handleScroll(e, "hero")}
                        className="hover:text-[#6367FF] transition-colors border-b border-gray-100 pb-3"
                    >
                        Home
                    </a>
                    <a
                        href="#about"
                        onClick={(e) => handleScroll(e, "about")}
                        className="hover:text-[#6367FF] transition-colors border-b border-gray-100 pb-3"
                    >
                        About
                    </a>
                    <a
                        href="#discover-brides"
                        onClick={(e) => handleScroll(e, "discover-brides")}
                        className="hover:text-[#6367FF] transition-colors border-b border-gray-100 pb-3"
                    >
                        Discover Brides
                    </a>
                    <a
                        href="#faq"
                        onClick={(e) => handleScroll(e, "faq")}
                        className="hover:text-[#6367FF] transition-colors pb-1"
                    >
                        FAQ
                    </a>
                </div>
                <div className="flex flex-col gap-3 mt-2">
                    <a
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full py-4 text-center rounded-xl bg-[#E2DCFF] text-black font-bold hover:bg-[#c9c0fb] transition-colors"
                    >
                        Login
                    </a>
                    <a
                        href="/sign-up"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full py-4 text-center rounded-xl bg-[#6367FF] text-white font-bold hover:bg-[#6367FF]/90 transition-colors"
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        </nav>
    );
}
