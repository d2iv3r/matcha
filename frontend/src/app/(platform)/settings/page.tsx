"use client";
import { useState, useRef, useEffect } from "react";
import {
    X,
    Mail,
    NotepadText,
    Tags,
    User,
    Utensils,
    Coffee,
    CupSoda,
    GlassWater,
    Gamepad2,
    Tv,
    Dumbbell,
    Trophy,
    Waves,
    Tent,
    Music,
    Film,
    Camera,
    BookOpen,
    Brush,
    Mic2,
    Theater,
    Plane,
    Map,
    ShoppingBag,
    GraduationCap,
    Heart,
    Mars,
    Venus,
    Lock,
    EyeOff,
    Eye,
    ShieldBan,
} from "lucide-react";
import { users, status } from "@/core/components/fake-data";
import Image from "next/image";
import girl from "@/public/girl1.png";

interface User {
    name: string;
    age: number;
    city: string;
    country: string;
    status: string;
    matching: boolean;
    image: string;
}

const INTERESTS = [
    { id: "food", label: "Food & Cooking", icon: <Utensils size={16} /> },
    { id: "coffee", label: "Coffee", icon: <Coffee size={16} /> },
    { id: "tea", label: "Moroccan Tea", icon: <CupSoda size={16} /> },
    { id: "nightlife", label: "Nightlife", icon: <GlassWater size={16} /> },
    { id: "gaming", label: "Gaming", icon: <Gamepad2 size={16} /> },
    { id: "anime", label: "Anime", icon: <Tv size={16} /> },
    { id: "fitness", label: "Fitness", icon: <Dumbbell size={16} /> },
    { id: "football", label: "Football", icon: <Trophy size={16} /> },
    { id: "swimming", label: "Swimming", icon: <Waves size={16} /> },
    { id: "camping", label: "Camping", icon: <Tent size={16} /> },
    { id: "music", label: "Music", icon: <Music size={16} /> },
    { id: "movies", label: "Movies", icon: <Film size={16} /> },
    { id: "photography", label: "Photography", icon: <Camera size={16} /> },
    { id: "reading", label: "Reading", icon: <BookOpen size={16} /> },
    { id: "art", label: "Painting & Art", icon: <Brush size={16} /> },
    { id: "karaoke", label: "Karaoke", icon: <Mic2 size={16} /> },
    { id: "theater", label: "Theater", icon: <Theater size={16} /> },
    { id: "travel", label: "Travel", icon: <Plane size={16} /> },
    { id: "adventure", label: "Adventure", icon: <Map size={16} /> },
    { id: "fashion", label: "Fashion", icon: <ShoppingBag size={16} /> },
    { id: "education", label: "Learning", icon: <GraduationCap size={16} /> },
    { id: "dating", label: "Romance", icon: <Heart size={16} /> },
];

const INTERESTS_USER = [
    { id: "food", label: "Food & Cooking", icon: <Utensils size={16} /> },
    { id: "coffee", label: "Coffee", icon: <Coffee size={16} /> },
    { id: "tea", label: "Moroccan Tea", icon: <CupSoda size={16} /> },
    { id: "nightlife", label: "Nightlife", icon: <GlassWater size={16} /> },
    { id: "gaming", label: "Gaming", icon: <Gamepad2 size={16} /> },
    { id: "anime", label: "Anime", icon: <Tv size={16} /> },
];

function BasicInfo() {
    const [selectedInterests, setSelectedInterests] = useState<string[]>(
        INTERESTS_USER.map((i) => i.label),
    );
    const [lookingFor, setLookingFor] = useState<"man" | "woman" | "">("man");
    const [tagInput, setTagInput] = useState("");
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowTagDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const addTag = (label: string) => {
        if (!selectedInterests.includes(label)) {
            setSelectedInterests([...selectedInterests, label]);
        }
        setTagInput("");
        setShowTagDropdown(false);
    };

    const removeTag = (tagToRemove: string) => {
        setSelectedInterests(
            selectedInterests.filter((tag) => tag !== tagToRemove),
        );
    };

    const availableTags = INTERESTS.filter(
        (i) =>
            !selectedInterests.includes(i.label) &&
            i.label.toLowerCase().includes(tagInput.toLowerCase()),
    );
    return (
        <div className="w-full h-full p-4">
            <div className="w-full flex flex-col gap-4 pb-10">
                <div className="w-full flex flex-col gap-3">
                    <div className="w-full flex flex-col gap-1">
                        <h2 className="text-md font-semibold">
                            Personal Infos :
                        </h2>
                        <p className="text-xs text-gray-500">
                            Update your personal information
                        </p>
                    </div>
                    <div className="flex flex-row gap-4 w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <h3 className="pl-4 text-sm">First name</h3>
                            <div className="flex flex-row items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl">
                                <User className="w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Abdellah"
                                    className="text-xs bg-transparent outline-none w-full placeholder-black/50"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <h3 className="pl-4 text-sm">Last name</h3>
                            <div className="flex flex-row items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl">
                                <User className="w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="El Kacem"
                                    className="text-xs bg-transparent outline-none w-full placeholder-black/50"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4 w-full pb-4">
                        <div className="flex flex-col gap-2 w-full">
                            <h3 className="pl-4 text-sm">Username</h3>
                            <div className="flex flex-row items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl">
                                <User className="w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Kacimo"
                                    className="text-xs bg-transparent outline-none w-full placeholder-black/50"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <h3 className="pl-4 text-sm">Email</h3>
                            <div className="flex flex-row items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl">
                                <Mail className="w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="abdellah.elkacem@gmail.com"
                                    className="text-xs bg-transparent outline-none w-full placeholder-black"
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="w-[98%] mx-auto border-[#AEB0FF]" />
                    <h2 className="text-md font-semibold">
                        Bio & Interested tags :
                    </h2>
                    <div className="flex flex-col gap-2 w-1/2">
                        <h3 className="pl-4 text-sm">Biography</h3>
                        <div className="flex flex-row items-start gap-2 px-3 py-[7px] min-h-16 bg-white border border-[#6367FF] rounded-xl">
                            <NotepadText className="w-5 h-5" />
                            <textarea
                                placeholder="Good vibes, good food, and good conversations. I enjoy discovering new places, late-night talks, and laughing about random things."
                                className="text-xs bg-transparent outline-none w-full min-h-16 pr-2 placeholder-black"
                            />
                        </div>
                    </div>
                    <div
                        className="flex flex-col gap-2 w-full mb-2"
                        ref={dropdownRef}
                    >
                        <h3 className="pl-4 text-sm">Tags</h3>
                        <div className="flex flex-row flex-wrap items-center gap-3 w-full">
                            <div className="relative w-full max-w-[300px]">
                                <div className="flex items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl w-full">
                                    <Tags className="w-5 h-5 text-black" />
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) =>
                                            setTagInput(e.target.value)
                                        }
                                        onFocus={() => setShowTagDropdown(true)}
                                        className="w-full bg-transparent outline-none text-sm placeholder-black/50"
                                        placeholder="Add tags ..."
                                    />
                                </div>
                                {showTagDropdown &&
                                    availableTags.length > 0 && (
                                        <div className="absolute top-full left-0 mt-2 bg-white w-full max-h-40 overflow-y-auto rounded-xl shadow-xl border border-gray-100 z-50 flex flex-col p-2">
                                            {availableTags.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() =>
                                                        addTag(t.label)
                                                    }
                                                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#F5F3FF] text-[#4B4B4B] hover:text-[#6367FF] rounded-lg transition-colors text-left"
                                                >
                                                    {t.icon}
                                                    <span className="text-xs font-medium">
                                                        {t.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                            </div>

                            {selectedInterests.map((tag) => {
                                const interest = INTERESTS.find(
                                    (i) => i.label === tag,
                                );
                                return (
                                    <span
                                        key={tag}
                                        className="bg-[#DFD8FF] text-[#555EFF] text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-2"
                                    >
                                        {interest?.icon}
                                        {tag}
                                        <X
                                            size={16}
                                            className="cursor-pointer hover:text-red-500 transition-colors ml-1"
                                            onClick={() => removeTag(tag)}
                                        />
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                    <hr className="w-[98%] mx-auto border-[#AEB0FF]" />
                    <div className="flex flex-col items-start justify-between gap-4 w-full mb-4">
                        <h2 className="text-md font-semibold">Show Me :</h2>
                        <div className="flex flex-row gap-6 justify-around items-center w-1/3">
                            <div
                                onClick={() => setLookingFor("man")}
                                className={`flex flex-1 p-3 flex-row gap-3 justify-center items-center  rounded-2xl cursor-pointer transition-all ${
                                    lookingFor === "man"
                                        ? "bg-[#6367FF] text-white"
                                        : "bg-[#E2DCFF]"
                                }`}
                            >
                                <Mars size={16} />
                                <p className="font-medium text-xs">Male</p>
                            </div>
                            <div
                                onClick={() => setLookingFor("woman")}
                                className={`flex flex-1 p-3 flex-row gap-3 justify-center items-center rounded-2xl cursor-pointer transition-all ${
                                    lookingFor === "woman"
                                        ? "bg-[#6367FF] text-white"
                                        : "bg-[#E2DCFF]"
                                }`}
                            >
                                <Venus size={16} />
                                <p className="font-medium text-xs">Female</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Security() {
    const [locationAccess, setLocationAccess] = useState<boolean | null>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const getPasswordScore = (pass: string) => {
        let score = 0;
        if (pass.length > 5) score += 1;
        if (pass.length > 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    const score = getPasswordScore(newPassword);

    const getStrengthColor = () => {
        if (!newPassword) return "bg-[#E2DCFF]";
        if (score <= 2) return "bg-red-500";
        if (score <= 4) return "bg-orange-500";
        return "bg-green-500";
    };

    const getStrengthText = () => {
        if (!newPassword) return "";
        if (score <= 2) return "Bad Password";
        if (score <= 4) return "Medium Password";
        return "Strong Password";
    };

    const strengthColor = getStrengthColor();

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4">
            <div className="flex flex-col items-start justify-between gap-4 w-full mb-4">
                <h2 className="text-md font-semibold">Password :</h2>
                <div className="flex flex-col gap-2 w-full lg:w-1/2">
                    <h3 className="pl-4 text-sm">Current Password</h3>
                    <div className="flex items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl">
                        <Lock className="w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            className="text-xs bg-transparent outline-none w-full placeholder-black"
                        />
                        <button
                            onClick={() => {
                                setShowPassword(!showPassword);
                            }}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex gap-4 w-full flex-col lg:flex-row">
                    <div className="flex flex-col gap-2 w-full lg:w-1/2">
                        <h3 className="pl-4 text-sm">New password</h3>
                        <div className="flex flex-row items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl">
                            <Lock className="w-5 h-5" />
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="********"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="text-xs bg-transparent outline-none w-full placeholder-black"
                            />
                            <button
                                onClick={() => {
                                    setShowNewPassword(!showNewPassword);
                                }}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <div className="flex flex-col gap-1 px-1">
                            {newPassword && (
                                <p
                                    className={`text-xs font-medium h-4 transition-colors duration-300 ${
                                        score <= 2
                                            ? "text-red-500"
                                            : score <= 4
                                              ? "text-orange-500"
                                              : "text-green-500"
                                    }`}
                                >
                                    {getStrengthText()}
                                </p>
                            )}
                            <div className="flex gap-2 w-full h-1 mt-1">
                                <div
                                    className={`flex-1 rounded-full transition-all duration-300 ${newPassword ? strengthColor : "bg-[#E2DCFF]"}`}
                                ></div>
                                <div
                                    className={`flex-1 rounded-full transition-all duration-300 ${score > 2 ? strengthColor : "bg-[#E2DCFF]"}`}
                                ></div>
                                <div
                                    className={`flex-1 rounded-full transition-all duration-300 ${score > 4 ? strengthColor : "bg-[#E2DCFF]"}`}
                                ></div>
                            </div>
                            <p className="text-[10px] font-medium text-black/30 mt-1">
                                8+ characters including a special character.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full lg:w-1/2">
                        <h3 className="pl-4 text-sm">Re-write new password</h3>
                        <div className={`flex flex-row items-center gap-2 px-3 py-[7px] bg-white border rounded-xl transition-colors ${confirmPassword && newPassword !== confirmPassword ? "border-red-500" : confirmPassword && newPassword === confirmPassword ? "border-green-500" : "border-[#6367FF]"}`}>
                            <Lock className="w-5 h-5" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="text-xs bg-transparent outline-none w-full placeholder-black"
                            />
                            <button
                                onClick={() => {
                                    setShowConfirmPassword(
                                        !showConfirmPassword,
                                    );
                                }}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <div className="flex flex-col gap-1 px-1 h-4">
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs font-medium text-red-500">
                                    Passwords do not match
                                </p>
                            )}
                            {confirmPassword && newPassword === confirmPassword && (
                                <p className="text-xs font-medium text-green-500">
                                    Passwords match
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <hr className="w-[98%] mx-auto border-[#AEB0FF] mt-2" />
                <div className="flex flex-col items-start gap-4 w-full lg:w-1/2 mb-4">
                    <h2 className="text-md font-semibold">Localisation :</h2>
                    <div className="w-full flex gap-2 flex-col">
                        <p className="pl-3 text-sm">Location access :</p>
                        <div className="w-full flex flex-col gap-4">
                            <div className="w-full h-[150px] bg-[url('/map-image.png')] rounded-2xl bg-cover bg-center border border-[#6367FF]" />
                            <div className="w-full flex flex-row gap-5">
                                <button
                                    onClick={() => setLocationAccess(true)}
                                    className={`flex-1 rounded-xl flex items-center justify-center p-2 border border-[#6367FF] transition-colors duration-300 ${
                                        locationAccess === true
                                            ? "bg-[#6367FF] text-white cursor-pointer"
                                            : "bg-[#E2DCFF] cursor-pointer text-black"
                                    }`}
                                >
                                    <p className="font-semibold text-sm">
                                        Approve
                                    </p>
                                </button>
                                <button
                                    onClick={() => setLocationAccess(false)}
                                    className={`flex-1 rounded-xl flex items-center justify-center p-2 border border-[#6367FF] transition-colors duration-300 ${
                                        locationAccess === false
                                            ? "bg-[#6367FF] text-white cursor-pointer"
                                            : "bg-[#E2DCFF] cursor-pointer text-black"
                                    }`}
                                >
                                    <p className="font-semibold text-sm">
                                        Decline
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Blocked() {
    return (
        <div className="w-full h-full p-4 grid lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {users.map((user, index) => {
                const statusColor =
                    status.find((s) => s.name === user.status)?.color ||
                    "#000000";
                return (
                    <div key={index} className="w-full px-1 py-1 mt-auto">
                        <div className="flex gap-3 flex-row min-w-0 bg-white flex-1 p-3 rounded-3xl">
                            <Image
                                src={girl}
                                alt="Profile"
                                width={100}
                                height={100}
                                className="rounded-2xl aspect-square object-cover shadow-lg shrink-0"
                            />
                            <div className="flex flex-col justify-between py-1">
                                <div className="flex flex-col justify-start">
                                    <p className="font-bold text-xs md:text-sm text-gray-900 truncate">
                                        {user.name},{" "}
                                        <span className="">{user.age}</span>
                                    </p>
                                    <p className="text-gray-500 text-xs truncate">
                                        {user.city}, <span>{user.country}</span>
                                    </p>
                                    <p
                                        className="text-xs mt-1 truncate font-semibold"
                                        style={{ color: statusColor }}
                                    >
                                        {user.status}
                                    </p>
                                </div>
                                <button className="relative group w-fit p-1 rounded-full hover:bg-red-50 transition-colors">
                                    <ShieldBan className="w-4 h-4 text-red-500" />
                                    <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2 px-2 py-1 bg-[#4B4B4B] text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-sm shadow-black/10">
                                        Unblock
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<
        "basic" | "security" | "blocked"
    >("basic");
    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="relative w-full h-full flex flex-col gap-3 bg-[#F5F3FF] rounded-4xl shadow-xl p-4 min-h-0">
                <h1 className="px-4 py-2 font-semibold text-xl">Settings</h1>
                <div className="w-full flex-1 min-h-0 flex flex-col -space-y-0.5">
                    <div className="flex w-fit z-10 text-sm">
                        <button
                            onClick={() => setActiveTab("basic")}
                            className={`px-6 py-2 ${activeTab === "basic" ? "border-b-2 border-[#6367FF] text-[#6367FF]" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50"}`}
                        >
                            Basic Infos
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`px-6 py-2 ${activeTab === "security" ? "border-b-2 border-[#6367FF] text-[#6367FF]" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50"}`}
                        >
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab("blocked")}
                            className={`px-6 py-2 ${activeTab === "blocked" ? "border-b-2 border-[#6367FF] text-[#6367FF]" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50"}`}
                        >
                            Blocked Users
                        </button>
                    </div>
                    <div className="w-full flex-1 min-h-0 bg-[#E9E8FF] border-t-2 border-[#AEB0FF] rounded-b-3xl flex flex-col">
                        <div className="w-full flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                            {activeTab === "basic" && <BasicInfo />}
                            {activeTab === "security" && <Security />}
                            {activeTab === "blocked" && <Blocked />}
                        </div>
                        <div className="flex justify-end p-4 gap-5 text-xs">
                            <button className="border border-[#0d1292] text-[#0d1292] px-6 py-1.5 rounded-lg font-medium">
                                Cancel
                            </button>
                            <button className="bg-[#6367FF] text-white px-6 py-1.5 rounded-lg font-medium">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
