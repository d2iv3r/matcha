"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Heart, MessageCircleMore } from "lucide-react";
import girl from "@/public/girl1.png";

interface MatchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    myAvatar: string | null;
    matchAvatar: string | null;
    matchName: string;
    onChat: () => void;
}

export default function MatchOverlay({
    isOpen,
    onClose,
    myAvatar,
    matchAvatar,
    matchName,
    onChat,
}: MatchOverlayProps) {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setShouldRender(true);
    }, [isOpen]);

    if (!shouldRender) return null;

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

    return (
        <div
            className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-all duration-500 bg-black/90 backdrop-blur-xl overflow-hidden ${
                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"
            }`}
            onTransitionEnd={() => !isOpen && setShouldRender(false)}
        >
            {/* Animated Background Particles */}
            {isOpen && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-float-heart"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: 0.2
                            }}
                        >
                            <Heart size={Math.random() * 20 + 10} fill="#6367FF" color="transparent" />
                        </div>
                    ))}
                </div>
            )}

            <div className="relative flex flex-col items-center justify-center max-w-lg w-full text-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-16 right-0 text-white/50 hover:text-white transition-colors z-20"
                >
                    <X size={32} />
                </button>

                {/* Radiating Rings */}
                <div className={`absolute -z-10 transition-all duration-1000 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full animate-ping" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-ping delay-300" />
                </div>

                {/* Main Title Animation */}
                <div className={`mb-8 transition-all duration-700 delay-300 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                    <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-linear-to-r from-[#6367FF] via-[#FFAAC3] to-[#6367FF] animate-gradient tracking-tighter">
                        Match!
                    </h1>
                    <p className="text-white/70 mt-4 text-lg font-medium">
                        You and {matchName} have found each other
                    </p>
                </div>

                {/* Avatars Comparison */}
                <div className="flex items-center justify-center gap-4 relative mb-12">
                    {/* Glow effect behind avatars */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6367FF]/20 blur-3xl rounded-full transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0"}`} />

                    <div className={`relative w-32 h-32 md:w-44 md:h-44 rounded-3xl border-4 border-white/20 overflow-hidden shadow-2xl transition-all duration-700 delay-500 ${isOpen ? "translate-x-0 rotate-[-8deg] opacity-100 scale-100" : "-translate-x-20 -rotate-30 opacity-0 scale-50"}`}>
                        <Image
                            src={formatAvatar(myAvatar)}
                            alt="Me"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    <div className={`absolute z-10 bg-white p-3 rounded-2xl shadow-2xl transition-all duration-700 delay-700 ${isOpen ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-180 opacity-0"}`}>
                        <Heart size={32} fill="#6367FF" color="#6367FF" className="animate-heart-pop" />
                    </div>

                    <div className={`relative w-32 h-32 md:w-44 md:h-44 rounded-3xl border-4 border-white/20 overflow-hidden shadow-2xl transition-all duration-700 delay-500 ${isOpen ? "translate-x-0 rotate-[8deg] opacity-100 scale-100" : "translate-x-20 rotate-30 opacity-0 scale-50"}`}>
                        <Image
                            src={formatAvatar(matchAvatar)}
                            alt={matchName}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className={`flex flex-col gap-4 w-full px-8 transition-all duration-700 delay-900 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                    <button
                        onClick={onChat}
                        className="w-full bg-linear-to-r from-[#6367FF] to-[#A855F7] hover:shadow-2xl hover:shadow-indigo-500/40 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 group"
                    >
                        <span className="flex items-center justify-center gap-3 group-hover:scale-105 transition-transform">
                            <MessageCircleMore size={20} />
                            Send Message
                        </span>
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl backdrop-blur-md transition-all active:scale-95 border border-white/10"
                    >
                        Keep Browsing
                    </button>
                </div>
            </div>
        </div>
    );
}
