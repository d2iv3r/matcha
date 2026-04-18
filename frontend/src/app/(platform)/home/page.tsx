"use client";
import { useEffect, useState } from "react";
import { Heart, ChevronDown } from "lucide-react";
import { users, status } from "@/core/components/fake-data";

interface User {
    name: string;
    age: number;
    city: string;
    country: string;
    status: string;
    matching: boolean;
    image: string;
}

function UserCard({ user, statusColor }: { user: User; statusColor: string }) {
    const [isLiked, setIsLiked] = useState(false);



    return (
        <div className="group flex flex-col h-full bg-[#F5F3FF] p-2 shadow-xl rounded-2xl w-full cursor-pointer">
            <div className="w-full aspect-3.5/4 rounded-xl mb-1 overflow-hidden relative">
                <div
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${user.image})` }}
                />
                <div className="relative z-10 w-full flex justify-end items-start p-2 pointer-events-none">
                    {user.matching && (
                        <div className="bg-[#DFD8FF]/90 backdrop-blur-sm px-3 py-[6px] rounded-lg flex justify-center items-center shadow-sm pointer-events-auto">
                            <p className="text-xs text-[#6367FF] font-medium tracking-wide">
                                Matching
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full flex flex-row justify-between items-center gap-2 px-1 py-1 mt-auto">
                <div className="flex flex-col min-w-0 flex-1">
                    <p className="font-bold text-xs md:text-sm text-gray-900 truncate">
                        {user.name}, <span className="">{user.age}</span>
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                        {user.city}, <span>{user.country}</span>
                    </p>
                    <p
                        className="text-xs font-bold mt-1 truncate"
                        style={{ color: statusColor }}
                    >
                        {user.status}
                    </p>
                </div>
                <div className="relative flex justify-center items-center group/heart">
                    <Heart
                        color="#6367FF"
                        fill={user.matching || isLiked ? "#6367FF" : "none"}
                        className="cursor-pointer transition-transform hover:scale-110 active:scale-95 shrink-0"
                        size={25}
                        onClick={() => setIsLiked(!isLiked)}
                    />
                    <div className="absolute bottom-full mb-2 hidden group-hover/heart:block whitespace-nowrap bg-gray-800 text-white text-[10px] md:text-xs font-medium px-2 py-1 rounded shadow-lg pointer-events-none fade-in animate-in duration-200">
                        {user.matching || isLiked ? "Unlike" : "Like"}
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
    const [data, setData] = useState<any>(null);
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/v1/account/profile", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        // "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const jsonData = await res.json();
                console.log("Profile Result Data (fetch):", jsonData);
                setData(jsonData);
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        fetchProfile();
    }, []);

    // console.log("Profile Result Data (state):", data);

    
    const [userList, setUserList] = useState<User[]>(users);

    const handleSearch = () => {
        let filtered = users;
        
        if (cityFilter.trim() !== "") {
            filtered = filtered.filter(u => u.city.toLowerCase().includes(cityFilter.toLowerCase()));
        }
        
        if (selectedAges.length > 0) {
            filtered = filtered.filter(u => {
                if (selectedAges.includes("18-25") && u.age >= 18 && u.age <= 25) return true;
                if (selectedAges.includes("26-35") && u.age >= 26 && u.age <= 35) return true;
                if (selectedAges.includes("36+") && u.age >= 36) return true;
                return false;
            });
        }

        if (selectedRatings.length > 0) {
            filtered = filtered.filter(u => selectedRatings.includes(u.status));
        }

        // Tags mapping future hook point:
        // if (selectedTags.length > 0) filtered = filtered.filter(...)

        setUserList(filtered);
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
                        (s) => s.name === u.status,
                    );
                    const color = matchedStatus
                        ? matchedStatus.color
                        : "#34D399";
                    return <UserCard key={i} user={u} statusColor={color} />;
                })}
            </div>
        </div>
    );
}
