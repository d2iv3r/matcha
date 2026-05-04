"use client";
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useProfile } from "@/core/contexts/ProfileContext";
import { useRouter, useSearchParams } from "next/navigation";
import rating from "@/core/types/Rating";
import MatchOverlay from "@/core/constants/MatchOverlay";
import { ApiProfile } from "../../types/profiles";
import UserCard from "./UserCard";
import FilterBar from "./FilterBar";
import { INTERESTS } from "@/core/constants/interests";

function HomePageContent() {
    const [cityFilter, setCityFilter] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
    const [selectedAges, setSelectedAges] = useState<string[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [tagSearch, setTagSearch] = useState("");

    // Applied filters (synced with URL)
    const [appliedFilters, setAppliedFilters] = useState({
        city: "",
        tags: [] as string[],
        ratings: [] as string[],
        ages: [] as string[],
    });

    const { profile } = useProfile();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [rawProfiles, setRawProfiles] = useState<ApiProfile[]>([]);
    const [userList, setUserList] = useState<ApiProfile[]>([]);

    const [matchModal, setMatchModal] = useState<{
        isOpen: boolean;
        user: ApiProfile | null;
    }>({
        isOpen: false,
        user: null,
    });

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const limit = 10;
    const observer = useRef<IntersectionObserver | null>(null);

    const applyCurrentFilters = useCallback(
        (profiles: ApiProfile[], filters: typeof appliedFilters) => {
            let filtered = profiles;

            if (filters.city.trim() !== "") {
                filtered = filtered.filter(
                    (u) =>
                        (u.city &&
                            u.city
                                .toLowerCase()
                                .includes(filters.city.toLowerCase())) ||
                        (u.country &&
                            u.country
                                .toLowerCase()
                                .includes(filters.city.toLowerCase())),
                );
            }

            if (filters.ages.length > 0) {
                filtered = filtered.filter((u) => {
                    if (!u.age) return false;
                    if (
                        filters.ages.includes("18-25") &&
                        u.age >= 18 &&
                        u.age <= 25
                    )
                        return true;
                    if (
                        filters.ages.includes("26-35") &&
                        u.age >= 26 &&
                        u.age <= 35
                    )
                        return true;
                    if (
                        filters.ages.includes("36-45") &&
                        u.age >= 36 &&
                        u.age <= 45
                    )
                        return true;
                    if (filters.ages.includes("46+") && u.age >= 46)
                        return true;
                    return false;
                });
            }

            if (filters.ratings.length > 0) {
                filtered = filtered.filter((u) =>
                    filters.ratings.some((r) => r.includes(u.rating)),
                );
            }

            if (filters.tags.length > 0) {
                filtered = filtered.filter((u) =>
                    filters.tags.every((selectedTagName) => {
                        const interestObj = INTERESTS.find(
                            (i) =>
                                i.label === selectedTagName ||
                                i.id === selectedTagName,
                        );
                        return u.interests?.some(
                            (userInterest) =>
                                userInterest.toLowerCase() ===
                                    interestObj?.id.toLowerCase() ||
                                userInterest.toLowerCase() ===
                                    interestObj?.label.toLowerCase() ||
                                userInterest.toLowerCase() ===
                                    selectedTagName.toLowerCase(),
                        );
                    }),
                );
            }

            setUserList(filtered);
        },
        [],
    );

    // Initial load from URL and sync URL changes to applied filters
    useEffect(() => {
        const city = searchParams.get("city") || "";
        const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
        const ratings =
            searchParams.get("ratings")?.split(",").filter(Boolean) || [];
        const ages = searchParams.get("ages")?.split(",").filter(Boolean) || [];

        const newFilters = { city, tags, ratings, ages };
        setAppliedFilters(newFilters);

        // Also sync drafts to match the URL (for back button behavior)
        setCityFilter(city);
        setSelectedTags(tags);
        setSelectedRatings(ratings);
        setSelectedAges(ages);
    }, [searchParams]);

    // Re-filter when applied filters or raw data change
    useEffect(() => {
        applyCurrentFilters(rawProfiles, appliedFilters);
    }, [rawProfiles, appliedFilters, applyCurrentFilters]);

    const fetchProfiles = useCallback(
        async (currentOffset: number, append: boolean = false) => {
            setIsFetching(true);
            await new Promise((resolve) => setTimeout(resolve, 800));
            try {
                const res = await fetch(
                    `http://localhost:5001/api/v1/accounts/profiles?limit=${limit}&offset=${currentOffset}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
                const json = await res.json();
                const data = json.data;
                console.log("====================>data", data.profiles);

                if (data && data.profiles) {
                    setRawProfiles((prev) => {
                        if (!append) return data.profiles;
                        const existingIds = new Set(prev.map((p) => p.user_id));
                        const uniqueNew = data.profiles.filter(
                            (p: ApiProfile) => !existingIds.has(p.user_id),
                        );
                        return [...prev, ...uniqueNew];
                    });
                    setHasMore(data.profiles.length === limit);
                }
            } catch (e) {
                console.error("Failed to load profiles:", e);
            } finally {
                setIsFetching(false);
            }
        },
        [limit],
    );

    const handleLoadMore = useCallback(() => {
        if (isFetching || !hasMore) return;
        setOffset((prev) => {
            const nextOffset = prev + limit;
            fetchProfiles(nextOffset, true);
            return nextOffset;
        });
    }, [isFetching, hasMore, limit, fetchProfiles]);

    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetching) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    handleLoadMore();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetching, hasMore, handleLoadMore],
    );

    useEffect(() => {
        fetchProfiles(0, false);
    }, [fetchProfiles]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (cityFilter) params.set("city", cityFilter);
        if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
        if (selectedRatings.length > 0)
            params.set("ratings", selectedRatings.join(","));
        if (selectedAges.length > 0) params.set("ages", selectedAges.join(","));

        router.push(`/home?${params.toString()}`);
    };

    const handleClear = () => {
        setCityFilter("");
        setSelectedTags([]);
        setSelectedRatings([]);
        setSelectedAges([]);
        setTagSearch("");
        router.push("/home");
    };

    const toggleSelection = (
        item: string,
        state: string[],
        setState: React.Dispatch<React.SetStateAction<string[]>>,
    ) => {
        setState((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item],
        );
    };

    const toggleDropdown = (name: string) => {
        setActiveDropdown((prev) => (prev === name ? null : name));
    };

    return (
        <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-6">
            <FilterBar
                cityFilter={cityFilter}
                setCityFilter={setCityFilter}
                tagSearch={tagSearch}
                setTagSearch={setTagSearch}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                selectedRatings={selectedRatings}
                setSelectedRatings={setSelectedRatings}
                selectedAges={selectedAges}
                setSelectedAges={setSelectedAges}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                toggleDropdown={toggleDropdown}
                toggleSelection={toggleSelection}
                handleSearch={handleSearch}
                handleClear={handleClear}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {userList.map((u, i) => {
                    const matchedStatus = rating.find((r) =>
                        r.name.includes(u.rating),
                    );
                    const color = matchedStatus
                        ? matchedStatus.color
                        : "#34D399";
                    const displayRating = matchedStatus
                        ? matchedStatus.name
                        : u.rating;
                    return (
                        <UserCard
                            key={u.user_id}
                            user={u}
                            statusColor={color}
                            displayRating={displayRating}
                            onMatch={(u) =>
                                setMatchModal({ isOpen: true, user: u })
                            }
                        />
                    );
                })}
            </div>

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
                    router.push("/chat");
                }}
            />

            {hasMore && (
                <div
                    ref={lastElementRef}
                    className="w-full flex justify-center py-8"
                >
                    {isFetching && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-[#6367FF]/20 border-t-[#6367FF] rounded-full animate-spin"></div>
                            <p className="text-[#6367FF] text-xs font-semibold">
                                Loading more...
                            </p>
                        </div>
                    )}
                </div>
            )}

            {!hasMore && userList.length > 0 && (
                <div className="w-full text-center text-gray-500 mt-4 text-sm font-medium">
                    No more profiles to show
                </div>
            )}

            {userList.length === 0 && (
                <div className="w-full flex justify-center items-center h-48">
                    <p className="text-gray-500 font-medium">No match found.</p>
                </div>
            )}
        </div>
    );
}

export default function HomePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomePageContent />
        </Suspense>
    );
}
