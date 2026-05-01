"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Step2() {
    const router = useRouter();
    const [bio, setBio] = useState("");

    const handleNext = () => {
        const existingData = JSON.parse(
            localStorage.getItem("profile_data") || "{}",
        );
        localStorage.setItem(
            "profile_data",
            JSON.stringify({
                ...existingData,
                bio: bio.trim(),
            }),
        );
        router.push("/step3");
    };
    return (
        <div className="h-full w-full flex flex-col gap-4 items-center justify-between p-6">
            <div className="relative w-full flex flex-row gap-4 justify-between items-center mb-2">
                <div className="absolute w-full h-[3px] bg-[#6367FF]" />
                <div className="w-full flex flex-row gap-4 justify-between z-10">
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 bg-[#FFF0FE] rounded-full border-[3px] border-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        2
                    </div>
                    <div className="w-8 h-8 bg-[#FFF0FE] rounded-full border-[3px] border-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        3
                    </div>
                    <div className="w-8 h-8 bg-[#FFF0FE] rounded-full border-[3px] border-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        4
                    </div>
                    <div className="w-8 h-8 bg-[#FFF0FE] rounded-full border-[3px] border-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        5
                    </div>
                </div>
            </div>
            <div className="w-full flex-2 gap-2 flex flex-col px-3">
                <p className="text-md font-extrabold text-[#4B4B4B] mb-1">
                    Step 2 of 5
                </p>
                <h1 className="text-2xl font-medium">Complete your profile</h1>
                <p className="text-black/50 text-sm mb-3">
                    Write a short note to your future soulmate. Keep it
                    authentic and keep it brief.
                </p>
                <div className="w-full flex gap-2 flex-col">
                    <p className="pl-3 text-sm">Biography</p>
                    <textarea
                        className="w-full h-[150px] min-h-[150px] max-h-[180px] flex flex-col items-center justify-center p-3 bg-[#E2DCFF] rounded-2xl text-sm text outline-none"
                        placeholder="Tell us about yourself.."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
            </div>
            <div className="w-full flex flex-row gap-7">
                <button
                    onClick={() => {
                        router.push("/step1");
                    }}
                    className="w-full flex-1 flex flex-col items-center justify-center p-3 border rounded-2xl cursor-pointer"
                >
                    <p className="font-semibold text-black/50">Back</p>
                </button>
                <button
                    disabled={bio.trim().length === 0}
                    onClick={handleNext}
                    className={`w-full flex-2 flex flex-col items-center justify-center p-3 rounded-2xl transition-colors duration-300 ${
                        bio.trim().length > 0 ? "bg-[#6367FF] text-white cursor-pointer" : "bg-[#E2DCFF] text-black/50 cursor-not-allowed"
                    }`}
                >
                    <p className={`font-semibold ${bio.trim().length > 0 ? 'text-white' : 'text-black/50'}`}>Next</p>
                </button>
            </div>
        </div>
    );
}
