"use client";
import { redirect } from "next/navigation";
import { useState } from "react";
import {
    Utensils,
    Gamepad2,
    Tv,
    Plane,
    Coffee,
    GlassWater,
    Dumbbell,
    Trophy,
    Waves,
    Music,
    Film,
    Camera,
    BookOpen,
    CupSoda,
    Heart,
    Mic2,
    Brush,
    Tent,
    ShoppingBag,
    Map,
    Theater,
    GraduationCap,
    Check,
} from "lucide-react";

const INTERESTS = [
    { id: "food", label: "Food & Cooking", icon: <Utensils size={16} /> },
    { id: "coffee", label: "Coffee", icon: <Coffee size={16} /> },
    { id: "tea", label: "Moroccan Tea", icon: <CupSoda size={16} /> },
    { id: "nightlife", label: "Nightlife", icon: <GlassWater size={16} /> },
    { id: "gaming", label: "Gaming", icon: <Gamepad2 size={16} /> },
    { id: "anime", label: "Anime", icon: <Tv size={16} /> },
    { id: "fitness", label: "Fitness", icon: <Dumbbell size={16} /> },
    { id: "football", label: "Football", icon: <Trophy size={16} /> },
    { id: "swimming", label: "Swimming", icon: <Waves size={16} /> },
    { id: "camping", label: "Camping", icon: <Tent size={16} /> },
    { id: "music", label: "Music", icon: <Music size={16} /> },
    { id: "movies", label: "Movies", icon: <Film size={16} /> },
    { id: "photography", label: "Photography", icon: <Camera size={16} /> },
    { id: "reading", label: "Reading", icon: <BookOpen size={16} /> },
    { id: "art", label: "Painting & Art", icon: <Brush size={16} /> },
    { id: "karaoke", label: "Karaoke", icon: <Mic2 size={16} /> },
    { id: "theater", label: "Theater", icon: <Theater size={16} /> },
    { id: "travel", label: "Travel", icon: <Plane size={16} /> },
    { id: "adventure", label: "Adventure", icon: <Map size={16} /> },
    { id: "fashion", label: "Fashion", icon: <ShoppingBag size={16} /> },
    { id: "education", label: "Learning", icon: <GraduationCap size={16} /> },
    { id: "dating", label: "Romance", icon: <Heart size={16} /> },
];

export default function Page() {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (id: string) => {
        setSelectedInterests((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
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
                        redirect("/step2");
                    }}
                    className="w-full flex-1 flex flex-col items-center justify-center p-3 border rounded-2xl cursor-pointer"
                >
                    <p className="font-semibold text-black/50">Back</p>
                </button>
                <button
                    disabled={selectedInterests.length < 5}
                    onClick={() => {
                        redirect("/step4");
                    }}
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
