"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";
import { INTERESTS } from "@/core/constants/interests";


export default function Step3() {
    const router = useRouter();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (id: string) => {
        setSelectedInterests((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const handleNext = () => {
        const existingData = JSON.parse(
            localStorage.getItem("profile_data") || "{}",
        );
        localStorage.setItem(
            "profile_data",
            JSON.stringify({
                ...existingData,
                interests: selectedInterests,
            }),
        );
        router.push("/step4");
    };

    return (
        <div className="h-full w-full flex flex-col gap-4 items-center justify-between p-6">
            <div className="relative w-full flex flex-row gap-4 justify-between items-center mb-2">
                <div className="absolute w-full h-[3px] bg-[#6367FF]" />
                <div className="w-full flex flex-row gap-4 justify-between z-10">
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
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
                    Step 3 of 5
                </p>
                <h1 className="text-2xl font-medium">Complete your profile</h1>
                <p className="text-black/50 text-sm mb-3">
                    Pick at least 5 of your passions. These tags help us introduce you to
                    people who share your world.
                </p>
                <div className="w-full flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => {
                        const isSelected = selectedInterests.includes(
                            interest.id,
                        );
                        return (
                            <button
                                key={interest.id}
                                onClick={() => toggleInterest(interest.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-colors duration-300 ${
                                    isSelected
                                        ? "border-[#6367FF] bg-[#6367FF] text-white"
                                        : "border-[#E2DCFF] bg-[#E2DCFF] text-[#4B4B4B]"
                                }`}
                            >
                                {interest.icon}
                                <span
                                    className={`font-medium text-xs ${isSelected ? "text-white" : "text-[#4B4B4B]"}`}
                                >
                                    {interest.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="w-full flex flex-row gap-7">
                <button
                    onClick={() => {
                        router.push("/step2");
                    }}
                    className="w-full flex-1 flex flex-col items-center justify-center p-3 border rounded-2xl cursor-pointer"
                >
                    <p className="font-semibold text-black/50">Back</p>
                </button>
                <button
                    disabled={selectedInterests.length < 5}
                    onClick={handleNext}
                    className={`w-full flex-2 flex flex-col items-center justify-center p-3 rounded-2xl transition-colors duration-300 ${
                        selectedInterests.length >= 5 ? "bg-[#6367FF] text-white cursor-pointer" : "bg-[#E2DCFF] text-black/50 cursor-not-allowed"
                    }`}
                >
                    <p className={`font-semibold ${selectedInterests.length >= 5 ? 'text-white' : 'text-black/50'}`}>Next</p>
                </button>
            </div>
        </div>
    );
}
