"use client";

import { CircleOff } from "lucide-react";
import { ApiProfile } from "@/core/types/profiles";
import { SearchProfileCard } from "./SearchProfileCard";
import { Dispatch, SetStateAction } from "react";

interface AdvanceSearchResultsProps {
    isSearch: boolean;
    isFetching: boolean;
    searchResults: ApiProfile[];
    setMatchModal: Dispatch<SetStateAction<{ isOpen: boolean; user: ApiProfile | null }>>;
}

export const AdvanceSearchResults = ({
    isSearch,
    isFetching,
    searchResults,
    setMatchModal,
}: AdvanceSearchResultsProps) => {
    if (isSearch && !isFetching && searchResults.length > 0) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto scrollbar-hide pb-10 px-4">
                {searchResults.map((user, index: number) => (
                    <SearchProfileCard
                        key={`${user.username}-${index}`}
                        user={user}
                        onMatch={(u) => setMatchModal({ isOpen: true, user: u })}
                    />
                ))}
            </div>
        );
    }

    if (isFetching) {
        return (
            <div className="w-full flex-1 flex flex-col justify-center items-center gap-4 py-20">
                <div className="w-12 h-12 border-4 border-[#6367FF]/20 border-t-[#6367FF] rounded-full animate-spin"></div>
                <p className="text-[#6367FF] font-bold animate-pulse">
                    Finding your perfect match...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full flex-1 flex flex-col justify-center items-center gap-5 text-center px-4 py-16">
            <div className="bg-[#F5F3FF] shadow-inner p-6 rounded-full inline-flex items-center justify-center">
                <CircleOff size={50} className="text-[#6367FF]" />
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-800">
                    {isSearch ? "No matches found" : "Start your search"}
                </h3>
                <p className="text-sm font-medium text-gray-500 max-w-[300px] mx-auto">
                    {isSearch
                        ? "We couldn't find anyone matching those exact filters. Try adjusting your preferences!"
                        : "Adjust the filters above and hit Search to discover new people."}
                </p>
            </div>
        </div>
    );
};
