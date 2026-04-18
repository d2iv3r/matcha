"use client";

import Image from "next/image";
import man from "@/public/men-icone.svg";
import woman from "@/public/women-icone.svg";
import { Mars, Venus, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [gender, setGender] = useState<"man" | "woman" | "">("");
    const [lookingFor, setLookingFor] = useState<"man" | "woman" | "">("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [openDropdown, setOpenDropdown] = useState<
        "day" | "month" | "year" | null
    >(null);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    // Explicitly using 2024 as the base year for testing (our system clock is 2026!)
    const years = Array.from({ length: 100 }, (_, i) => 2026 - i);

    const checkIsUnder18 = () => {
        if (!day || !month || !year) return false;
        const birthDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
        );
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age < 18;
    };

    return (
        <div className="h-full w-full flex flex-col gap-4 items-center justify-between p-6">
            <div className="relative w-full flex flex-row gap-4 justify-between items-center mb-2">
                <div className="absolute w-full h-[3px] bg-[#6367FF]" />
                <div className="w-full flex flex-row gap-4 justify-between z-10">
                    <div className="w-8 h-8 bg-[#FFF0FE] rounded-full border-[3px] border-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        1
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
                    Step 1 of 5
                </p>
                <h1 className="text-2xl font-medium">Complete your profile</h1>
                <p className="text-black/50 text-sm mb-3">
                    Share your gender and who you're looking for to refine your
                    search.
                </p>
                <div className="w-full flex gap-3 flex-col justify-between">
                    <div className="w-full flex flex-row gap-6 justify-around items-center">
                        <div
                            onClick={() => setGender("man")}
                            className={`flex flex-1 p-4 py-5 flex-col gap-2 justify-center items-center rounded-2xl cursor-pointer transition-all ${
                                gender === "man"
                                    ? "bg-[#C6BAFF]"
                                    : "bg-[#E2DCFF]"
                            }`}
                        >
                            <Image
                                src={man}
                                alt="man"
                                width={60}
                                height={60}
                                priority
                                className={`w-auto h-auto ${gender === "man" ? "" : "opacity-50 grayscale"}`}
                            />
                            <p
                                className={`font-medium ${gender === "man" ? "text-black" : "text-black/50"}`}
                            >
                                I'm a man
                            </p>
                        </div>
                        <div
                            onClick={() => setGender("woman")}
                            className={`flex flex-1 p-4 py-5 flex-col gap-2 justify-center items-center rounded-2xl cursor-pointer transition-all ${
                                gender === "woman"
                                    ? "bg-[#C6BAFF]"
                                    : "bg-[#E2DCFF]"
                            }`}
                        >
                            <Image
                                src={woman}
                                alt="woman"
                                width={60}
                                height={60}
                                priority
                                className={`w-auto h-auto ${gender === "woman" ? "" : "opacity-50 grayscale"}`}
                            />
                            <p
                                className={`font-medium ${gender === "woman" ? "text-black" : "text-black/50"}`}
                            >
                                I'm a woman
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm">Show me</p>
                        <div className="w-full flex flex-row gap-6 justify-around items-center">
                            <div
                                onClick={() => setLookingFor("man")}
                                className={`flex flex-1 p-3 flex-row gap-2 justify-center items-center rounded-2xl cursor-pointer transition-all ${
                                    lookingFor === "man"
                                        ? "bg-[#6367FF] text-white"
                                        : "bg-[#E2DCFF]"
                                }`}
                            >
                                <Mars size={20} />
                                <p className="font-medium text-sm">Male</p>
                            </div>
                            <div
                                onClick={() => setLookingFor("woman")}
                                className={`flex flex-1 p-3 flex-row gap-2 justify-center items-center rounded-2xl cursor-pointer transition-all ${
                                    lookingFor === "woman"
                                        ? "bg-[#6367FF] text-white"
                                        : "bg-[#E2DCFF]"
                                }`}
                            >
                                <Venus size={20} />
                                <p className="font-medium text-sm">Female</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm">
                            Age <span className="text-red-700">*</span> :
                            <span className="text-xs text-black/50">
                                {" "}
                                (between 18 and 99)
                            </span>
                        </p>
                        <div className="w-full flex flex-row gap-6 justify-around items-center z-20">
                            <div
                                className="relative flex flex-1 p-3 flex-row gap-2 justify-between items-center bg-[#E2DCFF] rounded-2xl cursor-pointer"
                                onClick={() =>
                                    setOpenDropdown(
                                        openDropdown === "day" ? null : "day",
                                    )
                                }
                            >
                                <p
                                    className={`font-medium text-sm ${day ? "text-black" : "text-black/50"}`}
                                >
                                    {day || "DD"}
                                </p>
                                <ChevronDown
                                    size={20}
                                    className={`${day ? "text-black" : "text-black/50"}`}
                                />
                                {openDropdown === "day" && (
                                    <div className="absolute top-[110%] left-0 w-full bg-white border border-[#6367FF] rounded-xl shadow-lg z-50 max-h-[200px] overflow-y-auto">
                                        {days.map((d) => (
                                            <div
                                                key={d}
                                                className="p-2 text-center text-sm hover:bg-[#E2DCFF]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDay(String(d));
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div
                                className="relative flex flex-1 p-3 flex-row gap-2 justify-between items-center bg-[#E2DCFF] rounded-2xl cursor-pointer"
                                onClick={() =>
                                    setOpenDropdown(
                                        openDropdown === "month"
                                            ? null
                                            : "month",
                                    )
                                }
                            >
                                <p
                                    className={`font-medium text-sm ${month ? "text-black" : "text-black/50"}`}
                                >
                                    {month || "MM"}
                                </p>
                                <ChevronDown
                                    size={20}
                                    className={`${month ? "text-black" : "text-black/50"}`}
                                />
                                {openDropdown === "month" && (
                                    <div className="absolute top-[110%] left-0 w-full bg-white border border-[#6367FF] rounded-xl shadow-lg z-50 max-h-[200px] overflow-y-auto">
                                        {months.map((m) => (
                                            <div
                                                key={m}
                                                className="p-2 text-center text-sm hover:bg-[#E2DCFF]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMonth(String(m));
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {m}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div
                                className="relative flex flex-2 p-3 flex-row gap-2 justify-between items-center bg-[#E2DCFF] rounded-2xl cursor-pointer"
                                onClick={() =>
                                    setOpenDropdown(
                                        openDropdown === "year" ? null : "year",
                                    )
                                }
                            >
                                <p
                                    className={`font-medium text-sm ${year ? "text-black" : "text-black/50"}`}
                                >
                                    {year || "YYYY"}
                                </p>
                                <ChevronDown
                                    size={20}
                                    className={`${year ? "text-black" : "text-black/50"}`}
                                />
                                {openDropdown === "year" && (
                                    <div className="absolute top-[110%] left-0 w-full bg-white border border-[#6367FF] rounded-xl shadow-lg z-50 max-h-[200px] overflow-y-auto">
                                        {years.map((y) => (
                                            <div
                                                key={y}
                                                className="p-2 text-center text-sm hover:bg-[#E2DCFF]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setYear(String(y));
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {y}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {checkIsUnder18() && (
                            <p className="text-sm text-red-700">is under 18</p>
                        )}
                    </div>
                </div>
            </div>
            <button
                disabled={
                    !gender ||
                    !lookingFor ||
                    !day ||
                    !month ||
                    !year ||
                    checkIsUnder18()
                }
                onClick={() => {
                    const mappedGender = gender === "man" ? "male" : "female";
                    const formattedMonth = month.padStart(2, '0');
                    const formattedDay = day.padStart(2, '0');
                    const date_of_birth = `${year}-${formattedMonth}-${formattedDay}`;

                    const birthDateDate = new Date(Number(year), Number(month) - 1, Number(day));
                    const today = new Date();
                    let computedAge = today.getFullYear() - birthDateDate.getFullYear();
                    const m = today.getMonth() - birthDateDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDateDate.getDate())) {
                        computedAge--;
                    }

                    const existingData = JSON.parse(localStorage.getItem("profile_data") || "{}");
                    localStorage.setItem("profile_data", JSON.stringify({
                        ...existingData,
                        gender: mappedGender,
                        date_of_birth: date_of_birth,
                        age: computedAge
                    }));

                    router.push("/step2");
                }}
                className={`w-full flex flex-col items-center justify-center p-3 rounded-2xl transition-colors duration-300 ${
                    gender &&
                    lookingFor &&
                    day &&
                    month &&
                    year &&
                    !checkIsUnder18()
                        ? "bg-[#6367FF] cursor-pointer"
                        : "bg-[#E2DCFF] cursor-not-allowed"
                }`}
            >
                <p
                    className={`font-semibold ${gender && lookingFor && day && month && year && !checkIsUnder18() ? "text-white" : "text-black/50"}`}
                >
                    Next
                </p>
            </button>
        </div>
    );
}
