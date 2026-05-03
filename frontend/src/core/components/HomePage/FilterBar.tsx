"use client";
import React from "react";
import { ChevronDown, Search } from "lucide-react";
import ratingData from "@/core/constants/Rating";
import { INTERESTS } from "@/core/constants/interests";

interface FilterBarProps {
    cityFilter: string;
    setCityFilter: (val: string) => void;
    tagSearch: string;
    setTagSearch: (val: string) => void;
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
    selectedRatings: string[];
    setSelectedRatings: React.Dispatch<React.SetStateAction<string[]>>;
    selectedAges: string[];
    setSelectedAges: React.Dispatch<React.SetStateAction<string[]>>;
    activeDropdown: string | null;
    setActiveDropdown: (val: string | null) => void;
    toggleDropdown: (name: string) => void;
    toggleSelection: (
        item: string,
        state: string[],
        setState: React.Dispatch<React.SetStateAction<string[]>>,
    ) => void;
    handleSearch: () => void;
    handleClear: () => void;
}

export default function FilterBar({
    cityFilter,
    setCityFilter,
    tagSearch,
    setTagSearch,
    selectedTags,
    setSelectedTags,
    selectedRatings,
    setSelectedRatings,
    selectedAges,
    setSelectedAges,
    activeDropdown,
    setActiveDropdown,
    toggleDropdown,
    toggleSelection,
    handleSearch,
    handleClear,
}: FilterBarProps) {
    return (
        <div className="flex flex-row flex-wrap justify-end items-center font-semibold text-sm gap-3">
            <div className="bg-white text-black/60 px-4 py-2 rounded-xl flex flex-row items-center border border-transparent focus-within:border-[#6367FF]/50 transition-colors">
                <input
                    type="text"
                    placeholder="City"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="bg-transparent outline-none w-[180px] placeholder:text-black/60"
                />
            </div>

            <div className="relative">
                <div className="bg-white text-black/60 px-4 py-[6px] rounded-xl flex flex-row items-center border border-transparent focus-within:border-[#6367FF]/50 transition-colors w-[150px]">
                    <Search className="w-4 h-4 mr-2" />
                    <input
                        type="text"
                        placeholder={
                            selectedTags.length > 0
                                ? `Tags (${selectedTags.length})`
                                : "Tags"
                        }
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        onFocus={() => setActiveDropdown("tags")}
                        className="bg-transparent outline-none w-full placeholder:text-black/60 text-sm"
                    />
                    <ChevronDown
                        size={16}
                        className={`cursor-pointer transition-transform duration-300 ${activeDropdown === "tags" ? "rotate-180" : ""}`}
                        onClick={() => toggleDropdown("tags")}
                    />
                </div>
                {activeDropdown === "tags" && (
                    <div className="absolute top-full right-0 mt-3 p-2 bg-white rounded-xl shadow-xl shadow-black/10 z-20 border border-gray-100 min-w-[200px] max-w-[250px] max-h-[350px] overflow-y-auto">
                        <div className="flex flex-col gap-1">
                            {INTERESTS.filter((i) =>
                                i.label
                                    .toLowerCase()
                                    .includes(tagSearch.toLowerCase()),
                            ).map((interest) => {
                                const isSelected = selectedTags.includes(
                                    interest.label,
                                );
                                return (
                                    <button
                                        key={interest.id}
                                        onClick={() =>
                                            toggleSelection(
                                                interest.label,
                                                selectedTags,
                                                setSelectedTags,
                                            )
                                        }
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                                            isSelected
                                                ? "bg-[#6367FF] text-white"
                                                : "hover:bg-[#F5F3FF] text-[#4B4B4B] hover:text-[#6367FF]"
                                        }`}
                                    >
                                        <div
                                            className={`${isSelected ? "text-white" : "text-[#555EFF]"}`}
                                        >
                                            {interest.icon}
                                        </div>
                                        <span className="text-xs font-medium">
                                            {interest.label}
                                        </span>
                                    </button>
                                );
                            })}
                            {INTERESTS.filter((i) =>
                                i.label
                                    .toLowerCase()
                                    .includes(tagSearch.toLowerCase()),
                            ).length === 0 && (
                                <p className="text-xs text-black/50 text-center py-2">
                                    No tags found
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="relative">
                <button
                    onClick={() => toggleDropdown("rating")}
                    className="bg-white text-black/60 px-4 gap-5 py-2 rounded-xl flex flex-row items-center hover:bg-gray-50 transition-colors"
                >
                    <p>
                        Rating{" "}
                        {selectedRatings.length > 0 &&
                            `(${selectedRatings.length})`}
                    </p>
                    <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${activeDropdown === "rating" ? "rotate-180" : ""}`}
                    />
                </button>
                {activeDropdown === "rating" && (
                    <div className="absolute top-full right-0 mt-3 p-3 bg-white rounded-3xl shadow-xl shadow-black/10 z-20 border border-gray-100 w-35">
                        <div className="flex flex-col gap-2">
                            {ratingData.map((statusObj) => {
                                const rating = statusObj.name;
                                const isSelected =
                                    selectedRatings.includes(rating);
                                const color = statusObj.color;
                                return (
                                    <button
                                        key={rating}
                                        onClick={() =>
                                            toggleSelection(
                                                rating,
                                                selectedRatings,
                                                setSelectedRatings,
                                            )
                                        }
                                        className="flex items-center gap-2 px-4 py-1.5 rounded-xl border-2 transition-colors duration-300"
                                        style={
                                            isSelected
                                                ? {
                                                      backgroundColor: color,
                                                      borderColor: color,
                                                      color: "white",
                                                  }
                                                : {
                                                      backgroundColor:
                                                          "#E2DCFF",
                                                      borderColor: "#E2DCFF",
                                                      color: "#4B4B4B",
                                                  }
                                        }
                                    >
                                        <span className="font-semibold text-[11px]">
                                            {rating}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="relative">
                <button
                    onClick={() => toggleDropdown("age")}
                    className="bg-white text-black/60 px-4 gap-5 py-2 rounded-xl flex flex-row items-center hover:bg-gray-50 transition-colors"
                >
                    <p>
                        Age{" "}
                        {selectedAges.length > 0 && `(${selectedAges.length})`}
                    </p>
                    <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${activeDropdown === "age" ? "rotate-180" : ""}`}
                    />
                </button>
                {activeDropdown === "age" && (
                    <div className="absolute top-full right-0 mt-3 p-3 bg-white rounded-3xl shadow-xl shadow-black/10 z-20 border border-gray-100 w-25">
                        <div className="flex flex-col gap-2">
                            {["18-25", "26-35", "36-45", "46+"].map((age) => {
                                const isSelected = selectedAges.includes(age);
                                return (
                                    <button
                                        key={age}
                                        onClick={() =>
                                            toggleSelection(
                                                age,
                                                selectedAges,
                                                setSelectedAges,
                                            )
                                        }
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border-2 transition-colors duration-300 ${
                                            isSelected
                                                ? "border-[#6367FF] bg-[#6367FF] text-white"
                                                : "border-[#E2DCFF] bg-[#E2DCFF] text-[#4B4B4B]"
                                        }`}
                                    >
                                        <span
                                            className={`font-semibold text-[11px] ${isSelected ? "text-white" : "text-[#4B4B4B]"}`}
                                        >
                                            {age}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleClear}
                    className="bg-white text-[#6367FF] border border-[#6367FF] active:scale-95 transition-transform px-6 py-2 rounded-xl cursor-pointer font-semibold"
                >
                    Clear
                </button>
                <button
                    onClick={handleSearch}
                    className="bg-linear-to-r from-[#6367FF] to-[#1f27c2] active:scale-95 transition-transform text-white px-8 py-2 rounded-xl shadow-[0_4px_12px_rgba(99,103,255,0.4)] cursor-pointer font-semibold shadow-md"
                >
                    Show
                </button>
            </div>
        </div>
    );
}
