"use client";
import { useState, useRef, useEffect } from "react";
import { User, Mail, NotepadText, Tags, X, Lock } from "lucide-react";
import { INTERESTS } from "@/core/constants/interests";

interface BasicInfoProps {
    profileData: any;
    onUpdate: (data: any) => void;
}

export default function BasicInfo({ profileData, onUpdate }: BasicInfoProps) {
    const profile = profileData?.profile || {};

    const [formData, setFormData] = useState({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        gender: profile.gender || "male",
        gender_preference: profile.gender_preference || "all",
        interests: profile.interests || [],
    });

    const [tagInput, setTagInput] = useState("");
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync formData with profile data when it changes (e.g. after initial load)
    useEffect(() => {
        if (profile.user_id) {
            setFormData({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                email: profile.email || "",
                bio: profile.bio || "",
                gender: profile.gender || "male",
                gender_preference: profile.gender_preference || "all",
                interests: profile.interests || [],
            });
        }
    }, [profile.user_id]);

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
        if (!formData.interests.includes(label)) {
            const newInterests = [...formData.interests, label];
            setFormData({ ...formData, interests: newInterests });
            onUpdate({ interests: newInterests });
        }
        setTagInput("");
        setShowTagDropdown(false);
    };

    const removeTag = (tagToRemove: string) => {
        const newInterests = formData.interests.filter(
            (tag: string) => tag !== tagToRemove,
        );
        setFormData({ ...formData, interests: newInterests });
        onUpdate({ interests: newInterests });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        const newData = { ...formData, [name]: value };
        setFormData(newData);
        onUpdate({ [name]: value });
    };

    const availableTags = INTERESTS.filter(
        (i) =>
            !formData.interests.includes(i.label) &&
            i.label.toLowerCase().includes(tagInput.toLowerCase()),
    );

    return (
        <div className="w-full h-full p-4">
            <div className="w-full flex flex-col gap-4 pb-20">
                <div className="w-full flex flex-col gap-3">
                    <div className="w-full flex flex-col gap-1">
                        <h2 className="text-md font-semibold">
                            Personal Infos :
                        </h2>
                        <p className="text-xs text-gray-500">
                            Update your personal information
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <h3 className="pl-4 text-sm">First name</h3>
                            <div className="flex flex-row items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl">
                                <User className="w-5 h-5" />
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="First Name"
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
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="text-xs bg-transparent outline-none w-full placeholder-black/50"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full pb-4">
                        <div className="flex flex-col gap-2 w-full">
                            <h3 className="pl-4 text-sm">Username</h3>
                            <div className="flex flex-row items-center gap-2 px-3 py-[7px] bg-white border border-gray-300 rounded-xl cursor-not-allowed opacity-90">
                                <User className="w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={profile.username || ""}
                                    readOnly
                                    className="text-xs bg-transparent outline-none w-full text-gray-600 cursor-not-allowed"
                                />
                                <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <h3 className="pl-4 text-sm">Email</h3>
                            <div className="flex flex-row items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl">
                                <Mail className="w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    className="text-xs bg-transparent outline-none w-full placeholder-black"
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="w-[98%] mx-auto border-[#AEB0FF]" />
                    <h2 className="text-md font-semibold">
                        Bio & Interested tags :
                    </h2>
                    <div className="flex flex-col gap-2 md:w-1/2">
                        <h3 className="pl-4 text-sm">Biography</h3>
                        <div className="flex flex-row items-start gap-2 px-3 py-[7px] min-h-16 bg-white border border-[#6367FF] rounded-xl">
                            <NotepadText className="w-5 h-5" />
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                className="text-xs bg-transparent outline-none w-full min-h-16 pr-2 placeholder-black"
                            />
                        </div>
                    </div>
                    <div
                        className="flex flex-col gap-2 w-full pb-4"
                        ref={dropdownRef}
                    >
                        <h3 className="pl-4 text-sm">Tags</h3>
                        <div className="flex flex-row flex-wrap items-center gap-3 w-full ">
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
                                        <div className="absolute top-full left-0 mt-2 bg-white w-full max-h-40 overflow-y-auto rounded-xl shadow-xl border border-gray-100 z-[150] flex flex-col p-2">
                                            {availableTags.map((t: any, index: number) => (
                                                <button
                                                    key={`${t.id}-${index}`}
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

                            {formData.interests.map((tag: string) => {
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

                    <div className="flex flex-col gap-2 mb-[120px]">
                        <h2 className="text-md font-semibold">
                            Gender Preference :
                        </h2>
                        <div className="flex flex-col gap-3 pl-4">
                            <h4 className="text-sm font-medium">Show me :</h4>
                            <div className="flex flex-row gap-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="gender_preference"
                                        value="male"
                                        checked={formData.gender_preference === "male"}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-[#6367FF]"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-black transition-colors">Men</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="gender_preference"
                                        value="female"
                                        checked={formData.gender_preference === "female"}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-[#6367FF]"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-black transition-colors">Women</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="gender_preference"
                                        value="all"
                                        checked={formData.gender_preference === "all"}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-[#6367FF]"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-black transition-colors">Both</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
