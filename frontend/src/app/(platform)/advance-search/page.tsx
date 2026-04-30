"use client";
import {
    ChevronDown,
    X,
    Eye,
    MessageCircleMore,
    CircleOff,
    Heart,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { status } from "@/core/components/fake-data";
import { useProfile } from "@/core/contexts/ProfileContext";
import MatchOverlay from "@/core/components/MatchOverlay";
import { INTERESTS } from "@/core/constants/interests";
import girl from "@/public/girl1.png";

export interface ApiProfile {
    username: string;
    first_name?: string;
    last_name?: string;
    age: number | null;
    city: string | null;
    country: string | null;
    distance_km?: number | null;
    rating: string;
    avatar?: string | null;
    is_match: boolean;
    is_liked: boolean;
    user_id: number;
    interests?: string[];
    bio?: string;
}

const SearchProfileCard = ({
    user,
    onMatch,
}: {
    user: ApiProfile;
    onMatch: (u: ApiProfile) => void;
}) => {
    const [isLiked, setIsLiked] = useState(user.is_liked || user.is_match);
    const [isMatch, setIsMatch] = useState(user.is_match);
    const router = useRouter();

    const statusObj = status.find((s) =>
        s.name.toLowerCase().includes(user.rating.toLowerCase()),
    );
    const ratingColor = statusObj ? statusObj.color : "#4B4B4B";

    const imageUrl = user.avatar
        ? user.avatar.startsWith("/") && !user.avatar.startsWith("http")
            ? `http://localhost:5001${user.avatar.startsWith("/static") ? user.avatar : "/static" + (user.avatar.startsWith("/") ? "" : "/") + user.avatar}`
            : user.avatar
        : girl.src;

    const toggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const previousState = isLiked;
        const newState = !isLiked;
        setIsLiked(newState);

        try {
            const action = newState ? "like" : "unlike";
            const res = await fetch(
                `http://localhost:5001/api/v1/profile/${user.username}/${action}`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );

            if (!res.ok) {
                setIsLiked(previousState);
            } else {
                const json = await res.json();
                if (json.data?.is_match) {
                    setIsMatch(true);
                    onMatch(user);
                } else if (!newState) {
                    setIsMatch(false);
                }
            }
        } catch (error) {
            console.error("Failed to toggle like", error);
            setIsLiked(previousState);
        }
    };

    return (
        <div
            onClick={() => router.push(`/profile/${user.username}`)}
            className="flex flex-row gap-2 bg-[#F5F3FF] shadow-xl p-3 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer hover:bg-white transition-colors group"
        >
            <div className="relative border-4 border-[#F5F3FF] rounded-2xl shadow-2xl flex-1 group-hover:border-white transition-colors">
                <div
                    className="w-full h-full aspect-square bg-center bg-cover rounded-xl"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
                {isMatch && (
                    <div className="absolute bottom-2 right-2 text-[#6367FF] bg-[#DFD8FF]/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-semibold text-[#6367FF]">
                            Matching
                        </span>
                    </div>
                )}
            </div>
            <div className="w-full flex flex-col justify-between gap-3 py-3 flex-2 min-w-0">
                <div className="flex flex-row justify-between gap-2 min-w-0">
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-xs font-bold truncate text-gray-900">
                            {user.first_name || user.username},{" "}
                            {user.age || "N/A"}
                        </span>
                        <span className="text-[10px] text-gray-500 truncate font-medium">
                            {user.city || "Unknown"}
                            {user.country ? `, ${user.country}` : ""}
                        </span>
                        <span
                            className="text-[10px] font-bold truncate mt-1"
                            style={{ color: ratingColor }}
                        >
                            {statusObj?.name || user.rating}
                        </span>
                    </div>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/profile/${user.username}`);
                        }}
                    >
                        <Eye
                            size={18}
                            className="text-gray-400 hover:text-[#6367FF] transition-colors"
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-3">
                    <div
                        className="flex gap-2 items-center cursor-pointer active:scale-95 transition-transform"
                        onClick={toggleLike}
                    >
                        <Heart
                            size={18}
                            className="text-[#6367FF] transition-colors"
                            fill={isLiked ? "#6367FF" : "transparent"}
                        />
                    </div>
                    {isMatch && (
                        <div
                            className="flex gap-2 items-center cursor-pointer hover:scale-105 transition-transform"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/chat?user=${user.username}`);
                            }}
                        >
                            <MessageCircleMore
                                size={18}
                                className="text-[#6367FF]"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function AdvanceSearchPage() {
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
    // const [isViewed, setIsViewed] = useState(false);
    // const [isMessage, setIsMessage] = useState(false);

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
            if (sorting) params.append("sorting", sorting.toLowerCase());

            fameRatings.forEach((r) => {
                const rating = r.split(" ").pop();
                if (rating) params.append("rating", rating);
            });

            tags.forEach((t) => params.append("interests", t));
            console.log("params", params);

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
            console.log("json", json);
            setSearchResults(json.data?.profiles || []);
            setAdvanceSearch(false);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setIsFetching(false);
        }
    };

    const availableTags = INTERESTS.filter(
        (i) =>
            !tags.includes(i.label) &&
            i.label.toLowerCase().includes(tagInput.toLowerCase()),
    );

    const availableFameRatings = status.filter(
        (s) => !fameRatings.includes(s.name),
    );

    return (
        <div className="w-full h-full flex flex-col gap-5 px-4">
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
                                <span className="ml-2 text-sm">
                                    Fame rating
                                </span>
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
                                        {status.map((statusObj) => {
                                            const isSelected =
                                                fameRatings.includes(
                                                    statusObj.name,
                                                );
                                            return (
                                                <button
                                                    key={statusObj.name}
                                                    onClick={() => {
                                                        setFameRatings(
                                                            (prev) =>
                                                                prev.includes(
                                                                    statusObj.name,
                                                                )
                                                                    ? prev.filter(
                                                                          (r) =>
                                                                              r !==
                                                                              statusObj.name,
                                                                      )
                                                                    : [
                                                                          ...prev,
                                                                          statusObj.name,
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
                                                                    statusObj.color,
                                                            }}
                                                        ></div>
                                                        <span className="font-semibold text-xs">
                                                            {statusObj.name}
                                                        </span>
                                                    </div>
                                                    {isSelected && (
                                                        <X size={14} />
                                                    )}
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
                                        setShowSortingDropdown(
                                            !showSortingDropdown,
                                        )
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
                                        {["Ascending", "Descending"].map(
                                            (sortOption) => {
                                                const isSelected =
                                                    sorting === sortOption;
                                                return (
                                                    <button
                                                        key={sortOption}
                                                        onClick={() => {
                                                            setSorting(
                                                                sortOption,
                                                            );
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
                                        {tags.map((tag) => {
                                            const interest = INTERESTS.find(
                                                (i) => i.label === tag,
                                            );
                                            return (
                                                <span
                                                    key={tag}
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
                                                            (t) => (
                                                                <button
                                                                    key={t.id}
                                                                    onClick={() =>
                                                                        addTag(
                                                                            t.label,
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#F5F3FF] text-[#4B4B4B] hover:text-[#6367FF] rounded-lg transition-colors text-left"
                                                                >
                                                                    {t.icon}
                                                                    <span className="text-sm font-medium">
                                                                        {
                                                                            t.label
                                                                        }
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
            {isSearch && !isFetching && searchResults.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto scrollbar-hide pb-10 px-4">
                    {searchResults.map((user, index) => (
                        <SearchProfileCard
                            key={index}
                            user={user}
                            onMatch={(u) =>
                                setMatchModal({ isOpen: true, user: u })
                            }
                        />
                    ))}
                </div>
            ) : isFetching ? (
                <div className="w-full flex-1 flex flex-col justify-center items-center gap-4 py-20">
                    <div className="w-12 h-12 border-4 border-[#6367FF]/20 border-t-[#6367FF] rounded-full animate-spin"></div>
                    <p className="text-[#6367FF] font-bold animate-pulse">
                        Finding your perfect match...
                    </p>
                </div>
            ) : (
                <div className="w-full flex-1 flex flex-col justify-center items-center gap-5 text-center px-4 py-16">
                    <div className="bg-[#F5F3FF] shadow-inner p-6 rounded-full inline-flex items-center justify-center">
                        <CircleOff size={50} className="text-[#6367FF]" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl md:text-2xl font-extrabold text-gray-800">
                            {isSearch
                                ? "No matches found"
                                : "Start your search"}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 max-w-[300px] mx-auto">
                            {isSearch
                                ? "We couldn't find anyone matching those exact filters. Try adjusting your preferences!"
                                : "Adjust the filters above and hit Search to discover new people."}
                        </p>
                    </div>
                </div>
            )}

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
}
