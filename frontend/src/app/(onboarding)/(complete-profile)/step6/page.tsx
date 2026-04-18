"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function Page() {
    const router = useRouter();

    return (
        <div className="h-full w-full flex flex-col gap-7 items-center justify-between p-6">
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
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                </div>
            </div>
            <div className="w-full flex-2 gap-5 flex flex-col px-3 items-center">
                <div className="w-35 h-35 rounded-full flex items-center justify-center border-[3px] border-[#6367FF] p-3">
                    <Check size={80} color="#6367FF" />
                </div>
                <h1 className="text-3xl font-bold">Completed !</h1>
                <p className="text-sm mb-3 text-center w-[80%]">
                    You’re all set!{" "}
                    <span className="font-extrabold">Kacimo!</span> Your profile
                    is now complete and visible to other users. Get ready to
                    find your perfect match!
                </p>
            </div>
            <button
                onClick={() => {
                    router.push("/home");
                }}
                className="w-full flex flex-col items-center justify-center p-3 bg-[#6367FF] rounded-2xl"
            >
                <p className="font-semibold text-white">Go to your Homepage</p>
            </button>
        </div>
    );
}
