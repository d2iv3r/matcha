"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Heart, ChevronDown } from "lucide-react";
import { status } from "@/core/components/fake-data";
import { useProfile } from "@/core/contexts/ProfileContext";
import { useRouter } from "next/navigation";
import MatchOverlay from "@/core/components/MatchOverlay";

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

function UserCard({ user, statusColor, displayRating, onMatch }: { user: ApiProfile; statusColor: string; displayRating: string; onMatch: (u: ApiProfile) => void }) {
    const [isLiked, setIsLiked] = useState(user.is_liked || user.is_match);
    const [isMatch, setIsMatch] = useState(user.is_match);

    const imageUrl = user.avatar
        ? (user.avatar.startsWith("/") && !user.avatar.startsWith("http")
            ? `http://localhost:5001${user.avatar}`
            : user.avatar)
        : "/girl1.png";

    const toggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const previousState = isLiked;
        const newState = !isLiked;
        setIsLiked(newState);

        try {
            const action = newState ? "like" : "unlike";
            const res = await fetch(`http://localhost:5001/api/v1/profile/${user.username}/${action}`, {
                method: "POST",
                credentials: "include"
            });
            console.log("res", res);
            
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

    const router = useRouter();
    const go_to_profile = (username: string) => {
        router.push(`/profile/${username}`);
    };

    return (
        <div onClick={() => go_to_profile(user.username)} className="group flex flex-col h-full bg-[#F5F3FF] p-2 shadow-xl rounded-2xl w-full cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="w-full aspect-3.5/4 rounded-xl mb-1 overflow-hidden relative group/image">
                <Image
                    src={imageUrl}
                    alt={user.username}
                    fill
                    unoptimized
                    className="object-cover object-center transition-transform duration-500 group-hover/image:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                {isMatch && (
                    <div className="absolute top-3 right-3 bg-[#E2DCFF]/90 backdrop-blur-sm px-3 py-2 rounded-xl z-10 shadow-sm">
                        <p className="text-[9px] text-[#555EFF] font-semibold tracking-wider leading-none">
                            Matching
                        </p>
                    </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-[10px] line-clamp-2 italic mb-1">
                        "{user.bio}"
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {user.interests?.slice(0, 3).map((interest, idx) => (
                            <span key={idx} className="bg-white/20 backdrop-blur-md text-white text-[8px] px-1.5 py-0.5 rounded-full border border-white/30">
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row justify-between items-center gap-2 px-1 py-1 mt-auto">
                <div className="flex flex-col min-w-0 flex-1">
                    <p className="font-bold text-xs md:text-sm text-gray-900 truncate">
                        {user.username}, <span className="">{user.age || "N/A"}</span>
                    </p>
                    <p className="text-gray-500 text-[10px] md:text-xs truncate">
                        {(user.city || user.country) ? `${user.city}${user.city && user.country ? ", " : ""}${user.country}` : "Unknown"}
                    </p>
                    {user.distance_km !== undefined && user.distance_km !== null && (
                        <p className="text-[#6367FF] text-[10px] font-semibold">
                            {user.distance_km.toFixed(1)} km away
                        </p>
                    )}
                    <p
                        className="text-[10px] md:text-xs font-bold mt-0.5 truncate"
                        style={{ color: statusColor }}
                    >
                        {displayRating}
                    </p>
                </div>
                <div className="relative flex justify-center items-center group/heart">
                    <Heart
                        color="#6367FF"
                        fill={isLiked ? "#6367FF" : "none"}
                        className="cursor-pointer transition-transform hover:scale-110 active:scale-95 shrink-0"
                        size={25}
                        onClick={toggleLike}
                        // onClick={() => setIsLiked(!isLiked)}
                    />
                    <div className="absolute bottom-full mb-2 hidden group-hover/heart:block whitespace-nowrap bg-gray-800 text-white text-[10px] md:text-xs font-medium px-2 py-1 rounded shadow-lg pointer-events-none fade-in animate-in duration-200">
                        {isLiked ? "Unlike" : "Like"}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HomePage() {
    const [cityFilter, setCityFilter] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
    const [selectedAges, setSelectedAges] = useState<string[]>([]);
    
    const { profile, isLoading } = useProfile();
    const router = useRouter();
    
    const [rawProfiles, setRawProfiles] = useState<ApiProfile[]>([]);
    const [userList, setUserList] = useState<ApiProfile[]>([]);
    
    const [matchModal, setMatchModal] = useState<{isOpen: boolean, user: ApiProfile | null}>({
        isOpen: false,
        user: null
    });

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const limit = 10;
    const observer = useRef<IntersectionObserver | null>(null);

    const applyFilters = useCallback((profilesToFilter: ApiProfile[]) => {
        let filtered = profilesToFilter;
        
        if (cityFilter.trim() !== "") {
            filtered = filtered.filter(u => 
                (u.city && u.city.toLowerCase().includes(cityFilter.toLowerCase())) ||
                (u.country && u.country.toLowerCase().includes(cityFilter.toLowerCase()))
            );
        }
        
        if (selectedAges.length > 0) {
            filtered = filtered.filter(u => {
                if (!u.age) return false;
                if (selectedAges.includes("18-25") && u.age >= 18 && u.age <= 25) return true;
                if (selectedAges.includes("26-35") && u.age >= 26 && u.age <= 35) return true;
                if (selectedAges.includes("36+") && u.age >= 36) return true;
                return false;
            });
        }

        if (selectedRatings.length > 0) {
            filtered = filtered.filter(u => selectedRatings.some(r => r.includes(u.rating)));
        }

        setUserList(filtered);
    }, [cityFilter, selectedAges, selectedRatings]);

    const fetchProfiles = useCallback(async (currentOffset: number, append: boolean = false) => {
        setIsFetching(true);
        // "Have time" - Add a slight delay to make the loading state feel more natural and visible
        await new Promise(resolve => setTimeout(resolve, 800));
        try {
            const res = await fetch(`http://localhost:5001/api/v1/accounts/profiles?limit=${limit}&offset=${currentOffset}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await res.json();
            const data = json.data;
            // console.log("data", data);
            
            if (data && data.profiles) {
                setRawProfiles(prev => {
                    const newRaw = append ? [...prev, ...data.profiles] : data.profiles;
                    applyFilters(newRaw);
                    return newRaw;
                });
                setHasMore(data.profiles.length === limit);
            }
        } catch (e) {
            console.error("Failed to load profiles:", e);
        } finally {
            setIsFetching(false);
        }
    }, [limit, applyFilters]);

    const handleLoadMore = useCallback(() => {
        if (isFetching || !hasMore) return;
        setOffset(prev => {
            const nextOffset = prev + limit;
            fetchProfiles(nextOffset, true);
            return nextOffset;
        });
    }, [isFetching, hasMore, limit, fetchProfiles]);

    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isFetching) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                handleLoadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [isFetching, hasMore, handleLoadMore]);

    useEffect(() => {
        fetchProfiles(0, false);
    }, [fetchProfiles]);



    const handleSearch = () => {
        applyFilters(rawProfiles);
    };

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleSelection = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        setState(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const toggleDropdown = (name: string) => {
        setActiveDropdown(prev => prev === name ? null : name);
    };

    return (
        <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-6">
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
                    <button 
                        onClick={() => toggleDropdown("tags")}
                        className="bg-white text-black/60 px-4 gap-5 py-2 rounded-xl flex flex-row items-center hover:bg-gray-50 transition-colors"
                    >
                        <p>Tags {selectedTags.length > 0 && `(${selectedTags.length})`}</p>
                        <ChevronDown size={18} className={`transition-transform duration-300 ${activeDropdown === "tags" ? "rotate-180" : ""}`}/>
                    </button>
                    {activeDropdown === "tags" && (
                        <div className="absolute top-full right-0 mt-3 p-3 bg-white rounded-3xl shadow-xl shadow-black/10 z-20 border border-gray-100 min-w-[300px]">
                            <div className="flex flex-wrap gap-2">
                                {["Sports", "Music", "Art", "Gaming", "Coffee", "Travel"].map((tag) => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => toggleSelection(tag, selectedTags, setSelectedTags)}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border-2 transition-colors duration-300 ${
                                                isSelected ? "border-[#6367FF] bg-[#6367FF] text-white" : "border-[#E2DCFF] bg-[#E2DCFF] text-[#4B4B4B]"
                                            }`}
                                        >
                                            <span className={`font-semibold text-[11px] ${isSelected ? "text-white" : "text-[#4B4B4B]"}`}>{tag}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button 
                        onClick={() => toggleDropdown("rating")}
                        className="bg-white text-black/60 px-4 gap-5 py-2 rounded-xl flex flex-row items-center hover:bg-gray-50 transition-colors"
                    >
                        <p>Rating {selectedRatings.length > 0 && `(${selectedRatings.length})`}</p>
                        <ChevronDown size={18} className={`transition-transform duration-300 ${activeDropdown === "rating" ? "rotate-180" : ""}`}/>
                    </button>
                    {activeDropdown === "rating" && (
                        <div className="absolute top-full right-0 mt-3 p-3 bg-white rounded-3xl shadow-xl shadow-black/10 z-20 border border-gray-100 w-35">
                            <div className="flex flex-col gap-2">
                                {status.map((statusObj) => {
                                    const rating = statusObj.name;
                                    const isSelected = selectedRatings.includes(rating);
                                    const color = statusObj.color;
                                    return (
                                        <button
                                            key={rating}
                                            onClick={() => toggleSelection(rating, selectedRatings, setSelectedRatings)}
                                            className="flex items-center gap-2 px-4 py-1.5 rounded-xl border-2 transition-colors duration-300"
                                            style={
                                                isSelected
                                                    ? { backgroundColor: color, borderColor: color, color: "white" }
                                                    : { backgroundColor: "#E2DCFF", borderColor: "#E2DCFF", color: "#4B4B4B" }
                                            }
                                        >
                                            <span className="font-semibold text-[11px]">{rating}</span>
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
                        <p>Age {selectedAges.length > 0 && `(${selectedAges.length})`}</p>
                        <ChevronDown size={18} className={`transition-transform duration-300 ${activeDropdown === "age" ? "rotate-180" : ""}`}/>
                    </button>
                    {activeDropdown === "age" && (
                        <div className="absolute top-full right-0 mt-3 p-3 bg-white rounded-3xl shadow-xl shadow-black/10 z-20 border border-gray-100 w-25">
                            <div className="flex flex-col gap-2">
                                {["18-25", "26-35", "36+"].map((age) => {
                                    const isSelected = selectedAges.includes(age);
                                    return (
                                        <button
                                            key={age}
                                            onClick={() => toggleSelection(age, selectedAges, setSelectedAges)}
                                            className={`flex items-center gap-2 px-2 py-1.5 rounded-xl border-2 transition-colors duration-300 ${
                                                isSelected ? "border-[#6367FF] bg-[#6367FF] text-white" : "border-[#E2DCFF] bg-[#E2DCFF] text-[#4B4B4B]"
                                            }`}
                                        >
                                            <span className={`font-semibold text-[11px] ${isSelected ? "text-white" : "text-[#4B4B4B]"}`}>{age}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleSearch}
                    className="bg-linear-to-r from-[#6367FF] to-[#1f27c2] active:scale-95 transition-transform text-white px-8 py-2 rounded-xl shadow-[0_4px_12px_rgba(99,103,255,0.4)] cursor-pointer font-semibold shadow-md"
                >
                    Show
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {userList.map((u, i) => {
                    const matchedStatus = status.find(
                        (s) => s.name.includes(u.rating)
                    );
                    const color = matchedStatus
                        ? matchedStatus.color
                        : "#34D399";
                    const displayRating = matchedStatus
                        ? matchedStatus.name
                        : u.rating;
                    return <UserCard key={i} user={u} statusColor={color} displayRating={displayRating} onMatch={(u) => setMatchModal({isOpen: true, user: u})} />;
                })}
            </div>

            <MatchOverlay 
                isOpen={matchModal.isOpen}
                onClose={() => setMatchModal({isOpen: false, user: null})}
                myAvatar={profile?.profile?.avatar || null}
                matchAvatar={matchModal.user?.avatar || null}
                matchName={matchModal.user?.first_name || matchModal.user?.username || ""}
                onChat={() => {
                    setMatchModal({isOpen: false, user: null});
                    router.push("/chat");
                }}
            />
            
            {hasMore && (
                <div ref={lastElementRef} className="w-full flex justify-center py-8">
                    {isFetching && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-[#6367FF]/20 border-t-[#6367FF] rounded-full animate-spin"></div>
                            <p className="text-[#6367FF] text-xs font-semibold">Loading more...</p>
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
