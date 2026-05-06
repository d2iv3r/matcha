"use client";

import { ChevronDown, X } from "lucide-react";
import { INTERESTS } from "@/core/constants/interests";
import rating from "@/core/types/Rating";
import { Dispatch, SetStateAction, RefObject } from "react";

interface AdvanceSearchFiltersProps {
    fullName: string;
    setFullName: Dispatch<SetStateAction<string>>;
    city: string;
    setCity: Dispatch<SetStateAction<string>>;
    handleSearch: () => void;
    isFetching: boolean;
    advanceSearch: boolean;
    setAdvanceSearch: Dispatch<SetStateAction<boolean>>;
    ageMin: string;
    setAgeMin: Dispatch<SetStateAction<string>>;
    ageMax: string;
    setAgeMax: Dispatch<SetStateAction<string>>;
    fameRatings: string[];
    setFameRatings: Dispatch<SetStateAction<string[]>>;
    showFameDropdown: boolean;
    setShowFameDropdown: Dispatch<SetStateAction<boolean>>;
    fameDropdownRef: RefObject<HTMLDivElement | null>;
    sorting: string;
    setSorting: Dispatch<SetStateAction<string>>;
    showSortingDropdown: boolean;
    setShowSortingDropdown: Dispatch<SetStateAction<boolean>>;
    sortingDropdownRef: RefObject<HTMLDivElement | null>;
    tags: string[];
    tagInput: string;
    setTagInput: Dispatch<SetStateAction<string>>;
    showTagDropdown: boolean;
    setShowTagDropdown: Dispatch<SetStateAction<boolean>>;
    dropdownRef: RefObject<HTMLDivElement | null>;
    addTag: (label: string) => void;
    removeTag: (tag: string) => void;
    clearAll: () => void;
}

export const AdvanceSearchFilters = ({
    fullName,
    setFullName,
    city,
    setCity,
    handleSearch,
    isFetching,
    advanceSearch,
    setAdvanceSearch,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    fameRatings,
    setFameRatings,
    showFameDropdown,
    setShowFameDropdown,
    fameDropdownRef,
    sorting,
    setSorting,
    showSortingDropdown,
    setShowSortingDropdown,
    sortingDropdownRef,
    tags,
    tagInput,
    setTagInput,
    showTagDropdown,
    setShowTagDropdown,
    dropdownRef,
    addTag,
    removeTag,
    clearAll,
}: AdvanceSearchFiltersProps) => {
    const availableTags = INTERESTS.filter(
        (i) =>
            !tags.includes(i.label) &&
            i.label.toLowerCase().includes(tagInput.toLowerCase()),
    );

    return (
        <div className="w-full p-8 mt-5 flex flex-col bg-[#F5F3FF] rounded-4xl shadow-xl gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between">
                <div className="flex-3 flex flex-col gap-1">
                    <span className="ml-2 text-sm">Full name</span>
                    <div className="bg-[#E9E8FF] w-full py-[7px] px-4 rounded-xl">
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-transparent outline-none text-xs font-semibold placeholder:text-[#999999] text-gray-800"
                            placeholder="John Smith"
                        />
                    </div>
                </div>
                <div className="flex-2 flex flex-col gap-1">
                    <span className="ml-2 text-xs font-semibold">City</span>
                    <div className="bg-[#E9E8FF] w-full py-[7px] px-4 rounded-xl">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-transparent outline-none text-sm placeholder:text-[#999999] text-gray-800"
                            placeholder="New York"
                        />
                    </div>
                </div>
                <button
                    className="flex-1 max-w-fit flex justify-center items-center px-10 py-2.5 bg-linear-to-r from-[#6367FF] to-[#2d31ac] rounded-xl text-sm text-white font-bold cursor-pointer hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
                    onClick={handleSearch}
                    disabled={isFetching}
                >
                    {isFetching ? "Searching..." : "Search"}
                </button>
            </div>
            <span
                className="flex gap-2 text-[#6367FF] items-center text-sm font-semibold cursor-pointer max-w-fit"
                onClick={() => setAdvanceSearch(!advanceSearch)}
            >
                Advance search
                <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${advanceSearch ? "rotate-180" : ""}`}
                />
            </span>
            {advanceSearch && (
                <div className="flex flex-col gap-2 ">
                    <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="w-full flex-1 flex flex-col gap-1">
                            <span className="ml-2 text-sm">Age</span>
                            <div className="flex gap-2">
                                <div className="bg-[#E9E8FF] w-full p-2 px-4 rounded-xl">
                                    <input
                                        type="text"
                                        value={ageMin}
                                        onChange={(e) =>
                                            setAgeMin(e.target.value)
                                        }
                                        className="w-full bg-transparent outline-none text-sm placeholder:text-[#999999] text-gray-800"
                                        placeholder="Min"
                                    />
                                </div>
                                <div className="bg-[#E9E8FF] w-full p-2 px-4 rounded-xl">
                                    <input
                                        type="text"
                                        value={ageMax}
                                        onChange={(e) =>
                                            setAgeMax(e.target.value)
                                        }
                                        className="w-full bg-transparent outline-none text-sm placeholder:text-[#999999] text-gray-800"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="w-full flex-1 flex flex-col gap-1 relative"
                            ref={fameDropdownRef}
                        >
                            <span className="ml-2 text-sm">Fame rating</span>
                            <div
                                className="bg-[#E9E8FF] w-full p-2 px-4 rounded-xl flex items-center justify-between cursor-pointer"
                                onClick={() =>
                                    setShowFameDropdown(!showFameDropdown)
                                }
                            >
                                <span
                                    className={`text-sm ${fameRatings.length > 0 ? "text-gray-800 font-medium" : "text-[#999999]"}`}
                                >
                                    {fameRatings.length > 0
                                        ? `Selected (${fameRatings.length})`
                                        : "Pick your rating.."}
                                </span>
                                <ChevronDown
                                    size={20}
                                    className={`text-gray-500 transition-transform duration-300 ${showFameDropdown ? "rotate-180" : ""}`}
                                />
                            </div>
                            {showFameDropdown && (
                                <div className="absolute top-full left-0 mt-3 p-2 bg-white w-48 max-h-60 overflow-y-auto rounded-xl shadow-xl z-50 border border-gray-100 flex flex-col gap-1">
                                    {rating.map((ratingObj, index: number) => {
                                        const isSelected = fameRatings.includes(
                                            ratingObj.name,
                                        );
                                        return (
                                            <button
                                                key={`${ratingObj.name}-${index}`}
                                                onClick={() => {
                                                    setFameRatings((prev) =>
                                                        prev.includes(
                                                            ratingObj.name,
                                                        )
                                                            ? prev.filter(
                                                                  (r) =>
                                                                      r !==
                                                                      ratingObj.name,
                                                              )
                                                            : [
                                                                  ...prev,
                                                                  ratingObj.name,
                                                              ],
                                                    );
                                                }}
                                                className={`flex flex-row items-center justify-between px-3 py-2 hover:bg-[#F5F3FF] hover:text-[#6367FF] rounded-lg transition-colors cursor-pointer text-left ${isSelected ? "bg-[#F5F3FF] text-[#6367FF]" : "text-[#4B4B4B]"}`}
                                            >
                                                <div className="flex flex-row items-center gap-3">
                                                    <div
                                                        className="w-2 h-2 rounded-full shadow-sm"
                                                        style={{
                                                            backgroundColor:
                                                                ratingObj.color,
                                                        }}
                                                    ></div>
                                                    <span className="font-semibold text-xs">
                                                        {ratingObj.name}
                                                    </span>
                                                </div>
                                                {isSelected && <X size={14} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div
                            className="w-full flex-1 flex flex-col gap-1 relative"
                            ref={sortingDropdownRef}
                        >
                            <span className="ml-2 text-sm">Sorting</span>
                            <div
                                className="bg-[#E9E8FF] w-full p-2 px-4 rounded-xl flex items-center justify-between cursor-pointer"
                                onClick={() =>
                                    setShowSortingDropdown(!showSortingDropdown)
                                }
                            >
                                <span
                                    className={`text-sm ${sorting ? "text-gray-800 font-medium" : "text-[#999999]"}`}
                                >
                                    {sorting || "Pick sorting"}
                                </span>
                                <ChevronDown
                                    size={20}
                                    className={`text-gray-500 transition-transform duration-300 ${showSortingDropdown ? "rotate-180" : ""}`}
                                />
                            </div>
                            {showSortingDropdown && (
                                <div className="absolute top-full left-0 mt-3 p-2 bg-white w-48 max-h-60 overflow-y-auto rounded-xl shadow-xl z-50 border border-gray-100 flex flex-col gap-1">
                                    {["Age", "Interests", "Rating", "Distance"].map(
                                        (sortOption, index: number) => {
                                            const isSelected =
                                                sorting === sortOption;
                                            return (
                                                <button
                                                    key={`${sortOption}-${index}`}
                                                    onClick={() => {
                                                        setSorting(sortOption);
                                                        setShowSortingDropdown(
                                                            false,
                                                        );
                                                    }}
                                                    className={`flex flex-row items-center justify-between px-3 py-2 hover:bg-[#F5F3FF] hover:text-[#6367FF] rounded-lg transition-colors cursor-pointer text-left ${isSelected ? "bg-[#F5F3FF] text-[#6367FF]" : "text-[#4B4B4B]"}`}
                                                >
                                                    <span className="font-semibold text-xs">
                                                        {sortOption}
                                                    </span>
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-4 items-center justify-between">
                            <div className="flex-1 flex flex-col gap-1">
                                <span className="ml-2 text-sm">
                                    Interest tags
                                </span>
                                <div
                                    className="bg-[#E9E8FF] w-full p-2 px-3 rounded-xl flex items-center flex-wrap gap-2 text-gray-800 relative"
                                    ref={dropdownRef}
                                >
                                    {tags.map((tag, index: number) => {
                                        const interest = INTERESTS.find(
                                            (i) => i.label === tag,
                                        );
                                        return (
                                            <span
                                                key={`${tag}-${index}`}
                                                className="bg-[#DFDBFE] text-[#6367FF] text-sm font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5"
                                            >
                                                {interest?.icon}
                                                {tag}
                                                <X
                                                    size={14}
                                                    className="cursor-pointer hover:text-red-500 transition-colors ml-1"
                                                    onClick={() =>
                                                        removeTag(tag)
                                                    }
                                                />
                                            </span>
                                        );
                                    })}
                                    <div className="flex-1 relative min-w-[150px]">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) =>
                                                setTagInput(e.target.value)
                                            }
                                            onFocus={() =>
                                                setShowTagDropdown(true)
                                            }
                                            className="w-full bg-transparent outline-none text-sm placeholder:text-[#999999] py-1"
                                            placeholder="Add interest tags..."
                                        />
                                        {showTagDropdown &&
                                            availableTags.length > 0 && (
                                                <div className="absolute top-full left-0 mt-3 bg-white w-64 max-h-60 overflow-y-auto rounded-xl shadow-xl border border-gray-100 z-50 flex flex-col p-2">
                                                    {availableTags.map(
                                                        (t, index: number) => (
                                                            <button
                                                                key={`${t.id}-${index}`}
                                                                onClick={() =>
                                                                    addTag(
                                                                        t.label,
                                                                    )
                                                                }
                                                                className="flex items-center gap-3 px-3 py-2 hover:bg-[#F5F3FF] text-[#4B4B4B] hover:text-[#6367FF] rounded-lg transition-colors text-left"
                                                            >
                                                                {t.icon}
                                                                <span className="text-sm font-medium">
                                                                    {t.label}
                                                                </span>
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span
                            onClick={clearAll}
                            className="text-[#6367FF] font-bold text-xs underline underline-offset-2 cursor-pointer w-fit mt-5"
                        >
                            Clear all
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
