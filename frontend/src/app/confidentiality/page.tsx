"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { ArrowLeft, Lock, EyeOff, ShieldCheck, Database } from "lucide-react";

export default function ConfidentialityPolicy() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 text-gray-800 font-sans selection:bg-[#6367FF] selection:text-white">
            
            {/* Background Decorative Shapes */}
            {/* Pill shape */}
            <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[200px] bg-linear-to-tr from-[#6367FF]/20 to-[#AEB0FF]/20 rounded-full rotate-45 pointer-events-none shadow-sm"></div>
            {/* Hollow circle */}
            <div className="absolute top-[15%] right-[-5%] w-[300px] h-[300px] border-30 border-[#6367FF]/10 rounded-full pointer-events-none"></div>
            {/* Large offset circle */}
            <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-[#E9E8FF] rounded-full opacity-60 pointer-events-none"></div>
            {/* Small floating square */}
            <div className="absolute bottom-[20%] right-[10%] w-[150px] h-[150px] bg-linear-to-br from-[#6367FF]/10 to-transparent rounded-3xl -rotate-12 pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button 
                        onClick={() => window.history.back()}
                        className="inline-flex items-center text-sm font-medium text-[#6367FF] hover:text-[#4a4ec1] transition-colors mb-6 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </button>
                    <Link href="/">
                        <Image
                            src={logo}
                            alt="MatchVibe Logo"
                            priority={true}
                            width={140}
                            height={40}
                            className="mb-8 hover:opacity-80 transition-opacity"
                        />
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Confidentiality Policy
                    </h1>
                    <p className="mt-4 text-gray-500 text-lg">
                        Last updated: <span className="font-semibold text-gray-700">April 2026</span>
                    </p>
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    
                    {/* Intro */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-[#6367FF]">
                            <Lock className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-gray-900">1. Commitment to Privacy</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            At MatchVibe, your confidentiality is our highest priority. We understand that finding genuine connections requires trust. This Confidentiality Policy outlines our strict standards for protecting your personal information and ensuring your data remains yours alone.
                        </p>
                    </section>

                    {/* Information Collection */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-[#6367FF]">
                            <Database className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-gray-900">2. Information Security</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            We employ state-of-the-art encryption protocols to safeguard the data you choose to share. This includes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2 marker:text-[#6367FF]">
                            <li>End-to-end encryption for all direct messages and private communications.</li>
                            <li>Secure hashing protocols for password and authentication management.</li>
                            <li>Advanced firewall configurations to protect server infrastructure.</li>
                        </ul>
                    </section>
                    
                    {/* User Anonymity */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-[#6367FF]">
                            <EyeOff className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-gray-900">3. Control Over Visibility</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            You dictate who sees your profile and when. MatchVibe provides granular settings to adjust your visibility:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2 marker:text-[#6367FF]">
                            <li>Options to hide your profile from search engines or specific demographic groups.</li>
                            <li>The ability to browse in "Ghost Mode" if you have a premium subscription.</li>
                            <li>Strict measures preventing the extraction or sharing of your photos by third parties.</li>
                        </ul>
                    </section>

                    {/* Third Parties */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-[#6367FF]">
                            <ShieldCheck className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-gray-900">4. Zero Data Selling Policy</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            We believe that your love life is not a commodity. We pledge that:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2 marker:text-[#6367FF]">
                            <li>We will <b>never</b> sell your personal data to ad networks or data brokers.</li>
                            <li>Third-party integrations are strictly audited for privacy compliance.</li>
                            <li>Any data shared with external infrastructure partners is strictly anonymized and used solely to maintain app functionality.</li>
                        </ul>
                        <div className="bg-[#E9E8FF] border border-[#6367FF]/30 rounded-xl p-4 mt-8 flex items-center justify-start gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm shrink-0">
                                <Lock className="w-5 h-5 text-[#6367FF]" />
                            </div>
                            <p className="text-sm text-[#4B4B4B] font-medium leading-loose">
                                Have questions regarding how your data is handled? You can request a complete export of your personal data at any time from your account settings.
                            </p>
                        </div>
                    </section>

                    <div className="border-t border-gray-200 pt-8 mt-12 text-center text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} MatchVibe. All rights reserved.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
