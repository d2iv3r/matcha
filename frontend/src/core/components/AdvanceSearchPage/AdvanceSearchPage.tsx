"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApiProfile } from "@/core/types/profiles";
import { useProfile } from "@/core/contexts/ProfileContext";
import MatchOverlay from "@/core/constants/MatchOverlay";
import { AdvanceSearchFilters } from "./AdvanceSearchFilters";
import { AdvanceSearchResults } from "./AdvanceSearchResults";

export const AdvanceSearchPage = () => {
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [searchResults, setSearchResults] = useState<ApiProfile[]>([]);
    const { profile } = useProfile();
    const [matchModal, setMatchModal] = useState<{
        isOpen: boolean;
        user: ApiProfile | null;
    }>({
        isOpen: false,
        user: null,
    });
    const router = useRouter();

    // Form inputs state
    const [fullName, setFullName] = useState("");
    const [city, setCity] = useState("");
    const [ageMin, setAgeMin] = useState("");
    const [ageMax, setAgeMax] = useState("");
    const [fameRatings, setFameRatings] = useState<string[]>([]);
    const [sorting, setSorting] = useState("");

    // Tags state
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showFameDropdown, setShowFameDropdown] = useState(false);
    const fameDropdownRef = useRef<HTMLDivElement>(null);
    const [showSortingDropdown, setShowSortingDropdown] = useState(false);
    const sortingDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowTagDropdown(false);
            }
            if (
                fameDropdownRef.current &&
                !fameDropdownRef.current.contains(event.target as Node)
            ) {
                setShowFameDropdown(false);
            }
            if (
                sortingDropdownRef.current &&
                !sortingDropdownRef.current.contains(event.target as Node)
            ) {
                setShowSortingDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const addTag = (label: string) => {
        if (!tags.includes(label)) {
            setTags([...tags, label]);
        }
        setTagInput("");
        setShowTagDropdown(false);
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const clearAll = () => {
        setFullName("");
        setCity("");
        setAgeMin("");
        setAgeMax("");
        setFameRatings([]);
        setSorting("");
        setTagInput("");
        setTags([]);
        setSearchResults([]);
        setIsSearch(false);
    };

    const handleSearch = async () => {
        setIsFetching(true);
        setIsSearch(true);
        try {
            const params = new URLSearchParams();
            if (fullName.trim()) {
                const parts = fullName.trim().split(" ");
                params.append("first_name", parts[0]);
                if (parts.length > 1)
                    params.append("last_name", parts.slice(1).join(" "));
            }
            if (city.trim()) params.append("city", city.trim());
            if (ageMin) params.append("min_age", ageMin);
            if (ageMax) params.append("max_age", ageMax);
            if (sorting) {
                const sortField =
                    sorting === "Interests" ? "tags" : sorting.toLowerCase();
                params.append("sort_by", sortField);
            }

            fameRatings.forEach((r) => {
                const ratingName = r.split(" ").pop();
                if (ratingName) params.append("rating", ratingName);
            });

            tags.forEach((t) => params.append("interests", t));
            
            // Set an extremely high limit to essentially fetch "all" profiles
            params.append("limit", "1000000");


            const res = await fetch(
                `http://localhost:5001/api/v1/accounts/profiles/search?${params.toString()}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!res.ok) throw new Error("Search failed");

            const json = await res.json();
            setSearchResults(json.data?.profiles || []);
            setAdvanceSearch(false);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-5 px-4">
            <AdvanceSearchFilters
                fullName={fullName}
                setFullName={setFullName}
                city={city}
                setCity={setCity}
                handleSearch={handleSearch}
                isFetching={isFetching}
                advanceSearch={advanceSearch}
                setAdvanceSearch={setAdvanceSearch}
                ageMin={ageMin}
                setAgeMin={setAgeMin}
                ageMax={ageMax}
                setAgeMax={setAgeMax}
                fameRatings={fameRatings}
                setFameRatings={setFameRatings}
                showFameDropdown={showFameDropdown}
                setShowFameDropdown={setShowFameDropdown}
                fameDropdownRef={fameDropdownRef}
                sorting={sorting}
                setSorting={setSorting}
                showSortingDropdown={showSortingDropdown}
                setShowSortingDropdown={setShowSortingDropdown}
                sortingDropdownRef={sortingDropdownRef}
                tags={tags}
                tagInput={tagInput}
                setTagInput={setTagInput}
                showTagDropdown={showTagDropdown}
                setShowTagDropdown={setShowTagDropdown}
                dropdownRef={dropdownRef}
                addTag={addTag}
                removeTag={removeTag}
                clearAll={clearAll}
            />

            <AdvanceSearchResults
                isSearch={isSearch}
                isFetching={isFetching}
                searchResults={searchResults}
                setMatchModal={setMatchModal}
            />

            <MatchOverlay
                isOpen={matchModal.isOpen}
                onClose={() => setMatchModal({ isOpen: false, user: null })}
                myAvatar={profile?.profile?.avatar || null}
                matchAvatar={matchModal.user?.avatar || null}
                matchName={
                    matchModal.user?.first_name ||
                    matchModal.user?.username ||
                    ""
                }
                onChat={() => {
                    setMatchModal({ isOpen: false, user: null });
                    router.push(`/chat?user=${matchModal.user?.username}`);
                }}
            />
        </div>
    );
};
