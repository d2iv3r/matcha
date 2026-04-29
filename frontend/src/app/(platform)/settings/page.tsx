"use client";
import { useState, useRef, useEffect } from "react";
import {
    X,
    Mail,
    NotepadText,
    Tags,
    User,
    Lock,
    EyeOff,
    Eye,
    ShieldBan,
    Camera,
    Plus,
    Trash2,
    Upload,
    RotateCcw,
    RotateCw,
    FlipHorizontal,
    Maximize2,
    Crop,
    Check,
} from "lucide-react";
import { users, status } from "@/core/components/fake-data";
import NextImage from "next/image";
import girl from "@/public/girl1.png";
import { useProfile } from "@/core/contexts/ProfileContext";

interface User {
    name: string;
    age: number;
    city: string;
    country: string;
    status: string;
    matching: boolean;
    image: string;
}

import { INTERESTS } from "@/core/constants/interests";

function BasicInfo({
    profileData,
    onUpdate,
}: {
    profileData: any;
    onUpdate: (data: any) => void;
}) {
    const profile = profileData?.profile || {};

    const [formData, setFormData] = useState({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        gender: profile.gender || "male",
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

    const handleGenderChange = (gender: string) => {
        setFormData({ ...formData, gender });
        onUpdate({ gender });
    };

    const availableTags = INTERESTS.filter(
        (i) =>
            !formData.interests.includes(i.label) &&
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
                    <div className="flex flex-row gap-4 w-full pb-4">
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
                    <div className="flex flex-col gap-2 w-1/2">
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
                        className="flex flex-col gap-2 w-full mb-[120px]"
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
                </div>
            </div>
        </div>
    );
}

function Security() {
    const [locationAccess, setLocationAccess] = useState<boolean | null>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);

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
                        <div
                            className={`flex flex-row items-center gap-2 px-3 py-[7px] bg-white border rounded-xl transition-colors ${confirmPassword && newPassword !== confirmPassword ? "border-red-500" : confirmPassword && newPassword === confirmPassword ? "border-green-500" : "border-[#6367FF]"}`}
                        >
                            <Lock className="w-5 h-5" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
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
                            {confirmPassword &&
                                newPassword !== confirmPassword && (
                                    <p className="text-xs font-medium text-red-500">
                                        Passwords do not match
                                    </p>
                                )}
                            {confirmPassword &&
                                newPassword === confirmPassword && (
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
                            <NextImage
                                src={user.image}
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

function Gallery({
    profileData,
    onUpdate,
}: {
    profileData: any;
    onUpdate: (data: any) => void;
}) {
    const profile = profileData?.profile || {};
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        profile.avatar || null,
    );
    const [allPictures, setAllPictures] = useState<any[]>(
        profile.pictures || [],
    );
    const [isDragging, setIsDragging] = useState(false);

    // Editor State
    const [editingImage, setEditingImage] = useState<{
        index: number;
        src: string;
    } | null>(null);
    const [rotation, setRotation] = useState(0);
    const [filter, setFilter] = useState("none");
    const [flip, setFlip] = useState({ h: 1, v: 1 });
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        if (profile.avatar) setAvatarPreview(profile.avatar);
        if (profile.pictures) setAllPictures(profile.pictures);
    }, [profile.avatar, profile.pictures]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            onUpdate({ avatar: file });
        }
    };

    const handleUpload = (files: File[]) => {
        const remaining = 4 - allPictures.length;
        if (files.length > 0 && remaining > 0) {
            const filesToAdd = files.slice(0, remaining);
            const updatedList = [...allPictures, ...filesToAdd];
            setAllPictures(updatedList);
            onUpdate({ allPictures: updatedList });
        }
    };

    const handlePicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleUpload(Array.from(e.target.files || []));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleUpload(Array.from(e.dataTransfer.files));
    };

    const removePicture = (index: number) => {
        const updatedList = allPictures.filter((_, i) => i !== index);
        setAllPictures(updatedList);
        onUpdate({ allPictures: updatedList });
    };

    const getPreview = (item: any) => {
        if (typeof item === "string") return item;
        try {
            return URL.createObjectURL(item);
        } catch (e) {
            return "";
        }
    };

    const startEditing = (index: number, src: string) => {
        setEditingImage({ index, src });
        setRotation(0);
        setFilter("none");
        setFlip({ h: 1, v: 1 });
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDraggingImage(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingImage || !imgNaturalSize.w) return;

        const previewSize = 400;
        const fitScale = Math.max(
            previewSize / imgNaturalSize.w,
            previewSize / imgNaturalSize.h,
        );
        const w = imgNaturalSize.w * fitScale * zoom;
        const h = imgNaturalSize.h * fitScale * zoom;

        const maxX = Math.max(0, (w - previewSize) / 2);
        const maxY = Math.max(0, (h - previewSize) / 2);

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        setPosition({
            x: Math.max(-maxX, Math.min(maxX, newX)),
            y: Math.max(-maxY, Math.min(maxY, newY)),
        });
    };

    const handleMouseUp = () => setIsDraggingImage(false);

    const applyEdits = async () => {
        if (!editingImage) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = editingImage.src;

        await new Promise((resolve) => {
            img.onload = resolve;
        });

        // Match high quality square output
        const size = 1024;
        canvas.width = size;
        canvas.height = size;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size);

        ctx.filter =
            filter === "none"
                ? "none"
                : filter === "grayscale"
                  ? "grayscale(1)"
                  : filter === "sepia"
                    ? "sepia(1)"
                    : filter === "invert"
                      ? "invert(1)"
                      : "none";

        // Base scale to COVER the preview container (400px)
        const previewSize = 400;
        const fitScale = Math.max(
            previewSize / img.width,
            previewSize / img.height,
        );

        const outputScale = size / previewSize;
        ctx.translate(size / 2, size / 2);
        ctx.translate(position.x * outputScale, position.y * outputScale);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(
            flip.h * zoom * outputScale * fitScale,
            flip.v * zoom * outputScale * fitScale,
        );
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const editedFile = new File(
                        [blob],
                        `edited_${Date.now()}.jpg`,
                        { type: "image/jpeg" },
                    );
                    const updatedList = [...allPictures];
                    updatedList[editingImage.index] = editedFile;
                    setAllPictures(updatedList);
                    onUpdate({ allPictures: updatedList });
                    setEditingImage(null);
                }
            },
            "image/jpeg",
            0.9,
        );
    };

    return (
        <div className="w-full h-full p-6 flex flex-col gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Avatar</h2>
                <p className="text-xs text-gray-500">
                    How you appear to others.
                </p>
                <div className="relative w-32 h-32 mt-2 group">
                    <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#6367FF] shadow-md bg-white">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-2 bg-[#6367FF] text-white rounded-xl cursor-pointer shadow-lg hover:scale-105 transition-all">
                        <Camera size={18} />
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </label>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold">Gallery</h2>
                    <p className="text-xs text-gray-500">
                        Drag and drop up to 4 photos.
                    </p>
                </div>

                <div
                    className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl transition-all ${isDragging ? "bg-[#6367FF]/10 ring-2 ring-[#6367FF] ring-dashed" : ""}`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    {allPictures.map((pic, index) => {
                        const preview = getPreview(pic);
                        return (
                            <div
                                key={index}
                                className="relative aspect-square rounded-2xl overflow-hidden group bg-gray-100 shadow-sm border border-gray-100"
                            >
                                <img
                                    src={preview}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() =>
                                            startEditing(index, preview)
                                        }
                                        className="p-2 bg-white text-[#6367FF] rounded-lg hover:scale-110 transition-all"
                                    >
                                        <Crop size={16} />
                                    </button>
                                    <button
                                        onClick={() => removePicture(index)}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {allPictures.length < 4 && (
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-[#AEB0FF] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white transition-all text-[#6367FF]">
                            <Upload size={24} />
                            <span className="text-[10px] font-medium">
                                Click or Drag
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handlePicturesChange}
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Image Editor Modal */}
            {editingImage && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
                        {/* Preview Area */}
                        <div className="flex-1 bg-black/5 flex flex-col items-center justify-center p-8 min-h-[450px]">
                            <div
                                className="relative w-full aspect-square max-w-[400px] overflow-hidden rounded-xl bg-white shadow-lg cursor-move select-none"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <img
                                    src={editingImage.src}
                                    onLoad={(e) => {
                                        const img = e.currentTarget;
                                        setImgNaturalSize({
                                            w: img.naturalWidth,
                                            h: img.naturalHeight,
                                        });
                                    }}
                                    style={{
                                        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${flip.h * zoom}, ${flip.v * zoom})`,
                                        filter:
                                            filter === "none"
                                                ? "none"
                                                : filter === "grayscale"
                                                  ? "grayscale(1)"
                                                  : filter === "sepia"
                                                    ? "sepia(1)"
                                                    : filter === "invert"
                                                      ? "invert(1)"
                                                      : "none",
                                    }}
                                    className="min-w-full min-h-full object-cover transition-transform duration-75 pointer-events-none"
                                />
                                {/* Square Crop Helper Overlay */}
                                <div className="absolute inset-0 ring-1 ring-inset ring-white/50 pointer-events-none border-[10px] border-black/10"></div>
                            </div>
                            <div className="w-full max-w-[400px] mt-6 flex flex-col gap-2">
                                <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                    <span>Zoom</span>
                                    <span>{Math.round(zoom * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={zoom}
                                    onChange={(e) =>
                                        setZoom(parseFloat(e.target.value))
                                    }
                                    className="w-full accent-[#6367FF] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="w-full md:w-64 p-6 flex flex-col gap-6 border-l border-gray-100 bg-white">
                            <h3 className="font-bold flex items-center gap-2 text-gray-800">
                                <Maximize2 size={18} /> Edit Image
                            </h3>

                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Adjustment
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            setRotation((r) => r - 90)
                                        }
                                        className="flex-1 p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <RotateCcw
                                            size={16}
                                            className="mx-auto"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setRotation((r) => r + 90)
                                        }
                                        className="flex-1 p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <RotateCw
                                            size={16}
                                            className="mx-auto"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setFlip((f) => ({
                                                ...f,
                                                h: f.h * -1,
                                            }))
                                        }
                                        className="flex-1 p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <FlipHorizontal
                                            size={16}
                                            className="mx-auto"
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Filters
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        "none",
                                        "grayscale",
                                        "sepia",
                                        "invert",
                                    ].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`py-1.5 px-3 text-[10px] rounded-lg border font-medium transition-all ${filter === f ? "bg-[#6367FF] border-[#6367FF] text-white shadow-md shadow-[#6367FF]/20" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                                        >
                                            {f.charAt(0).toUpperCase() +
                                                f.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-400 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <b>Tip:</b> Drag the image to pan and use the
                                slider to zoom for the perfect square crop.
                            </p>

                            <div className="mt-auto flex gap-3 pt-4">
                                <button
                                    onClick={() => setEditingImage(null)}
                                    className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={applyEdits}
                                    className="flex-1 py-3 px-4 bg-[#6367FF] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#555DFF] text-nowrap shadow-lg shadow-[#6367FF]/30 transition-all"
                                >
                                    <Check size={14} /> Save Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SettingsPage() {
    const { profile: profileData, isLoading, refetchProfile } = useProfile();
    const [activeTab, setActiveTab] = useState<
        "basic" | "gallery" | "security" | "blocked"
    >("basic");
    const [pendingChanges, setPendingChanges] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });

    const handleUpdate = (data: any) => {
        setPendingChanges((prev: any) => ({ ...prev, ...data }));
    };

    const handleSave = async () => {
        if (Object.keys(pendingChanges).length === 0) return;

        setIsSaving(true);
        setSaveMessage({ text: "", type: "" });

        try {
            const profileFields = [
                "first_name",
                "last_name",
                "email",
                "bio",
                "gender",
                "interests",
            ];
            const hasProfileChanges = profileFields.some(
                (key) => key in pendingChanges,
            );
            const hasMediaChanges =
                "avatar" in pendingChanges || "allPictures" in pendingChanges;

            if (hasProfileChanges) {
                const profileData = Object.fromEntries(
                    Object.entries(pendingChanges).filter(([key]) =>
                        profileFields.includes(key),
                    ),
                );
                const res = await fetch(
                    "http://localhost:5001/api/v1/accounts/profile",
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(profileData),
                        credentials: "include",
                    },
                );
                if (!res.ok) throw new Error("Failed to update profile info");
            }

            if (hasMediaChanges) {
                const formData = new FormData();
                if (pendingChanges.avatar) {
                    formData.append("avatar", pendingChanges.avatar);
                }

                if (pendingChanges.allPictures) {
                    pendingChanges.allPictures.forEach((pic: any) => {
                        // Clean the URL if it's a string from our backend
                        const value =
                            typeof pic === "string"
                                ? pic.replace("http://localhost:5001", "")
                                : pic;
                        formData.append("pictures", value);
                    });
                }

                const res = await fetch(
                    "http://localhost:5001/api/v1/accounts/profile/media",
                    {
                        method: "PATCH",
                        body: formData,
                        credentials: "include",
                    },
                );
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(
                        errorData.message || "Failed to update profile media",
                    );
                }
            }

            setSaveMessage({
                text: "Changes saved successfully!",
                type: "success",
            });
            setPendingChanges({});
            await refetchProfile();
        } catch (error: any) {
            console.error("Save error:", error);
            setSaveMessage({
                text:
                    error.message ||
                    "Failed to save changes. Please try again.",
                type: "error",
            });
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage({ text: "", type: "" }), 3000);
        }
    };

    if (isLoading && !profileData) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6367FF]"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="relative w-full h-full flex flex-col gap-3 bg-[#F5F3FF] rounded-4xl shadow-xl p-4 min-h-0">
                <div className="flex justify-between items-center px-4 py-2">
                    <h1 className="font-semibold text-xl">Settings</h1>
                    {saveMessage.text && (
                        <div
                            className={`text-xs px-4 py-2 rounded-xl animate-in fade-in slide-in-from-top-2 ${
                                saveMessage.type === "success"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {saveMessage.text}
                        </div>
                    )}
                </div>

                <div className="w-full flex-1 min-h-0 flex flex-col -space-y-0.5">
                    <div className="flex w-fit z-10 text-sm">
                        <button
                            onClick={() => setActiveTab("basic")}
                            className={`px-6 py-2 transition-colors ${activeTab === "basic" ? "border-b-2 border-[#6367FF] text-[#6367FF]" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50 hover:text-[#6367FF]/50"}`}
                        >
                            Basic Infos
                        </button>
                        <button
                            onClick={() => setActiveTab("gallery")}
                            className={`px-6 py-2 transition-colors ${activeTab === "gallery" ? "border-b-2 border-[#6367FF] text-[#6367FF]" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50 hover:text-[#6367FF]/50"}`}
                        >
                            Gallery
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`px-6 py-2 transition-colors ${activeTab === "security" ? "border-b-2 border-[#6367FF] text-[#6367FF]" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50 hover:text-[#6367FF]/50"}`}
                        >
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab("blocked")}
                            className={`px-6 py-2 transition-colors ${activeTab === "blocked" ? "border-b-2 border-[#6367FF] text-[#6367FF]" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50 hover:text-[#6367FF]/50"}`}
                        >
                            Blocked Users
                        </button>
                    </div>
                    <div className="w-full flex-1 min-h-0 bg-[#E9E8FF] border-t-2 border-[#AEB0FF] rounded-b-3xl flex flex-col">
                        <div className="w-full flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                            {activeTab === "basic" && (
                                <BasicInfo
                                    profileData={profileData}
                                    onUpdate={handleUpdate}
                                />
                            )}
                            {activeTab === "gallery" && (
                                <Gallery
                                    profileData={profileData}
                                    onUpdate={handleUpdate}
                                />
                            )}
                            {activeTab === "security" && <Security />}
                        </div>
                        <div className="flex justify-end p-4 gap-5 text-xs">
                            <button
                                onClick={() => {
                                    setPendingChanges({});
                                    refetchProfile();
                                }}
                                className="border border-[#0d1292] text-[#0d1292] px-6 py-1.5 rounded-lg font-medium hover:bg-[#0d1292]/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={
                                    isSaving ||
                                    Object.keys(pendingChanges).length === 0
                                }
                                className={`bg-[#6367FF] text-white px-6 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                    isSaving ||
                                    Object.keys(pendingChanges).length === 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-[#555DFF] cursor-pointer"
                                }`}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
