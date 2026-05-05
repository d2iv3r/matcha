"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { ArrowLeft, Scale, Shield, UserCheck, AlertCircle } from "lucide-react";

export default function TermsOfUse() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-50 text-gray-800 font-sans selection:bg-[#6367FF] selection:text-white">
            
            <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[200px] bg-linear-to-tr from-[#6367FF]/20 to-[#AEB0FF]/20 rounded-full rotate-45 pointer-events-none shadow-sm"></div>
            <div className="absolute top-[15%] right-[-5%] w-[300px] h-[300px] border-30 border-[#6367FF]/10 rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-[#E9E8FF] rounded-full opacity-60 pointer-events-none"></div>
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
                        Terms of Use
                    </h1>
                    <p className="mt-4 text-gray-500 text-lg">
                        Last updated: <span className="font-semibold text-gray-700">April 2026</span>
                    </p>
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    
                    {/* Introduction */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-[#6367FF]">
                            <Scale className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing or using MatchVibe, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
                        </p>
                    </section>

                    {/* Eligibility */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-[#6367FF]">
                            <UserCheck className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-gray-900">2. Eligibility</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            You must be at least 18 years old to create an account on MatchVibe and use the Service. By creating an account and using the Service, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2 marker:text-[#6367FF]">
                            <li>You can form a binding contract with MatchVibe.</li>
                            <li>You are not a person who is barred from using the Service under the laws of your applicable jurisdiction.</li>
                            <li>You will comply with this Agreement and all applicable local, state, national, and international laws, rules, and regulations.</li>
                        </ul>
                    </section>
                    
                    {/* Privacy */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-[#6367FF]">
                            <Shield className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-gray-900">3. Privacy</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Your privacy is important to us. Please read our Privacy Policy to understand how we collect, use, and share information about you. By using our Services, you agree that MatchVibe can use such data in accordance with our Privacy Policy.
                        </p>
                    </section>

                    {/* Guidelines */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-[#6367FF]">
                            <AlertCircle className="w-6 h-6" />
                            <h2 className="text-2xl font-bold text-gray-900">4. Community Guidelines</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            MatchVibe is a platform for genuine connections. We expect all users to treat others with respect. You agree not to use the platform to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2 marker:text-[#6367FF]">
                            <li>Harass, abuse, or harm another person.</li>
                            <li>Use our services for any illegal or unauthorized purpose.</li>
                            <li>Create multiple accounts to bypass restrictions or deceive others.</li>
                            <li>Share explicit, offensive, or inappropriate content.</li>
                        </ul>
                        <div className="bg-[#E9E8FF] border border-[#6367FF]/30 rounded-xl p-4 mt-8 flex items-center justify-start gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                <AlertCircle className="w-5 h-5 text-[#6367FF]" />
                            </div>
                            <p className="text-sm text-[#4B4B4B] font-medium leading-loose">
                                Violation of these guidelines may result in immediate termination of your account without notice.
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
