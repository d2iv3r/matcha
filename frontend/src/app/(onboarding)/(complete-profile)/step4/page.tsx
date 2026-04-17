"use client";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [locationAccess, setLocationAccess] = useState<boolean | null>(null);

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
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
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
                    Step 4 of 5
                </p>
                <h1 className="text-2xl font-medium">Complete your profile</h1>
                <p className="text-black/50 text-sm mb-3">
                    Help us find your match in the right neighborhood. We’ll use
                    your location to show you nearby soulmates while keeping
                    your exact address private.
                </p>
                <div className="w-full flex gap-2 flex-col">
                    <p className="pl-3 text-sm">Allow location access ?</p>
                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full h-[150px] bg-[url('/map-image.png')] rounded-2xl bg-cover bg-center border border-[#6367FF]" />
                        <div className="w-full flex flex-row gap-5">
                            <button 
                                onClick={() => setLocationAccess(true)}
                                className={`w-full rounded-xl flex items-center justify-center p-3 border border-[#6367FF] transition-colors duration-300 ${
                                    locationAccess === true ? "bg-[#6367FF] text-white cursor-pointer" : "bg-[#E2DCFF] cursor-pointer text-black"
                                }`}
                            >
                                <p className="font-semibold">Approve</p>
                            </button>
                            <button 
                                onClick={() => setLocationAccess(false)}
                                className={`w-full rounded-xl flex items-center justify-center p-3 border border-[#6367FF] transition-colors duration-300 ${
                                    locationAccess === false ? "bg-[#6367FF] text-white cursor-pointer" : "bg-[#E2DCFF] cursor-pointer text-black"
                                }`}
                            >
                                <p className="font-semibold">Decline</p>
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-black/50">
                        You can change your location anytime in settings
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-row gap-7">
                <button
                    onClick={() => {
                        redirect("/step3");
                    }}
                    className="w-full flex-1 flex flex-col items-center justify-center p-3 border rounded-2xl cursor-pointer"
                >
                    <p className="font-semibold text-black/50">Back</p>
                </button>
                <button
                    disabled={locationAccess === null}
                    onClick={() => {
                        redirect("/step5");
                    }}
                    className={`w-full flex-2 flex flex-col items-center justify-center p-3 rounded-2xl transition-colors duration-300 ${
                        locationAccess !== null ? "bg-[#6367FF] text-white cursor-pointer" : "bg-[#E2DCFF] text-black/50 cursor-not-allowed"
                    }`}
                >
                    <p className={`font-semibold ${locationAccess !== null ? 'text-white' : 'text-black/50'}`}>Next</p>
                </button>
            </div>
        </div>
    );
}
