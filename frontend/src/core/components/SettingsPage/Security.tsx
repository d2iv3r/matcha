"use client";
import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Globe, MapPin } from "lucide-react";

interface SecurityProps {
    profileData: any;
    onUpdate: (data: any) => void;
}

export default function Security({ profileData, onUpdate }: SecurityProps) {
    const profile = profileData?.profile || {};
    
    const [locationAccess, setLocationAccess] = useState<boolean | null>(
        profile.latitude && profile.longitude ? true : null
    );
    const [coordinates, setCoordinates] = useState<{
        lat: number;
        lng: number;
        city: string;
        country: string;
        ip: string;
    } | null>({
        lat: profile.latitude || 0,
        lng: profile.longitude || 0,
        city: profile.city || "",
        country: profile.country || "",
        ip: profile.ip_address || "",
    });
    
    const [manualCity, setManualCity] = useState(profile.city || "");
    const [manualCountry, setManualCountry] = useState(profile.country || "");
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const getPasswordScore = (pass: string) => {
        let score = 0;
        if (pass.length > 5) score += 1;
        if (pass.length >= 8) score += 1;
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

    const handlePasswordUpdate = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ text: "Please fill in all fields", type: "error" });
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage({ text: "Passwords do not match", type: "error" });
            return;
        }
        if (score < 3) {
            setMessage({
                text: "Password is too weak (8+ chars & special char)",
                type: "error",
            });
            return;
        }

        setIsUpdating(true);
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch(
                "http://localhost:5001/api/v1/accounts/security",
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword,
                        password_confirm: confirmPassword,
                    }),
                    credentials: "include",
                },
            );

            const data = await res.json();
            if (res.ok) {
                setMessage({
                    text: "Password updated successfully!",
                    type: "success",
                });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                throw new Error(data.message || "Failed to update password");
            }
        } catch (error: any) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setIsUpdating(false);
            setTimeout(() => setMessage({ text: "", type: "" }), 3000);
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4">
            <div className="flex flex-col items-start justify-between gap-4 w-full mb-4">
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-md font-semibold">Password :</h2>
                    {message.text && (
                        <p
                            className={`text-[10px] md:text-xs px-3 py-1 rounded-lg animate-in fade-in slide-in-from-top-1 ${
                                message.type === "success"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {message.text}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full lg:w-1/2">
                    <h3 className="pl-4 text-sm">Current Password</h3>
                    <div className="flex items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl shadow-sm focus-within:shadow-md transition-shadow">
                        <Lock className="w-5 h-5 text-[#6367FF]" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="text-xs bg-transparent outline-none w-full placeholder-black/40"
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-[#6367FF] transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div className="flex gap-4 w-full flex-col lg:flex-row">
                    <div className="flex flex-col gap-2 w-full lg:w-1/2">
                        <h3 className="pl-4 text-sm">New password</h3>
                        <div className="flex flex-row items-center gap-2 px-3 py-[7px] bg-white border border-[#6367FF] rounded-xl shadow-sm focus-within:shadow-md transition-shadow">
                            <Lock className="w-5 h-5 text-[#6367FF]" />
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="text-xs bg-transparent outline-none w-full placeholder-black/40"
                            />
                            <button
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="text-gray-400 hover:text-[#6367FF] transition-colors"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="flex flex-col gap-1 px-1">
                            {newPassword && (
                                <p className={`text-xs font-medium h-4 transition-colors duration-300 ${score <= 2 ? "text-red-500" : score <= 4 ? "text-orange-500" : "text-green-500"}`}>
                                    {getStrengthText()}
                                </p>
                            )}
                            <div className="flex gap-2 w-full h-1 mt-1">
                                <div className={`flex-1 rounded-full transition-all duration-300 ${newPassword ? strengthColor : "bg-[#E2DCFF]"}`}></div>
                                <div className={`flex-1 rounded-full transition-all duration-300 ${score > 2 ? strengthColor : "bg-[#E2DCFF]"}`}></div>
                                <div className={`flex-1 rounded-full transition-all duration-300 ${score > 4 ? strengthColor : "bg-[#E2DCFF]"}`}></div>
                            </div>
                            <p className="text-[10px] font-medium text-black/30 mt-1">
                                8+ characters including a special character.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full lg:w-1/2">
                        <h3 className="pl-4 text-sm">Re-write new password</h3>
                        <div className={`flex flex-row items-center gap-2 px-3 py-[7px] bg-white border rounded-xl shadow-sm transition-all ${confirmPassword && newPassword !== confirmPassword ? "border-red-500" : confirmPassword && newPassword === confirmPassword ? "border-green-500 shadow-[#22c55e]/10" : "border-[#6367FF]"}`}>
                            <Lock className="w-5 h-5 text-[#6367FF]" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="text-xs bg-transparent outline-none w-full placeholder-black/40"
                            />
                            <button
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-[#6367FF] transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="flex flex-col gap-1 px-1 h-4">
                            {confirmPassword && newPassword !== confirmPassword && <p className="text-[10px] font-medium text-red-500 animate-in fade-in">Passwords do not match</p>}
                            {confirmPassword && newPassword === confirmPassword && <p className="text-[10px] font-medium text-green-500 animate-in fade-in">Passwords match</p>}
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end mt-2">
                    <button
                        onClick={handlePasswordUpdate}
                        disabled={isUpdating || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || score < 3}
                        className={`bg-[#6367FF] text-white px-8 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#6367FF]/20 transition-all ${isUpdating || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || score < 3 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#555DFF] active:scale-95 cursor-pointer"}`}
                    >
                        {isUpdating ? "Updating..." : "Update Password"}
                    </button>
                </div>
                
                <hr className="w-[98%] mx-auto border-[#AEB0FF] mt-4" />
                
                <div className="flex flex-col items-start gap-4 w-full mb-10">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-md font-semibold">Localisation :</h2>
                        <p className="text-[10px] text-gray-500">Update your current location for better matches</p>
                    </div>
                    
                    <div className="w-full flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-1/2 flex flex-col gap-4">
                            <div className="w-full h-[150px] bg-[url('/map-image.png')] rounded-2xl bg-cover bg-center border border-[#6367FF] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                                {(coordinates || locationAccess === true) && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-xl animate-bounce">
                                        <MapPin className="w-5 h-5 text-[#6367FF]" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-row gap-4">
                                <button
                                    onClick={async () => {
                                        setIsLoadingLocation(true);
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                (pos) => {
                                                    const newCoords = {
                                                        lat: pos.coords.latitude,
                                                        lng: pos.coords.longitude,
                                                        city: profile.city || "",
                                                        country: profile.country || "",
                                                        ip: profile.ip_address || ""
                                                    };
                                                    setCoordinates(newCoords);
                                                    setLocationAccess(true);
                                                    onUpdate({
                                                        latitude: newCoords.lat,
                                                        longitude: newCoords.lng,
                                                        city: newCoords.city,
                                                        country: newCoords.country
                                                    });
                                                    setIsLoadingLocation(false);
                                                },
                                                () => {
                                                    setLocationAccess(true);
                                                    setIsLoadingLocation(false);
                                                }
                                            );
                                        } else {
                                            setIsLoadingLocation(false);
                                        }
                                    }}
                                    className={`flex-1 rounded-xl flex items-center justify-center gap-2 p-2.5 border-2 transition-all duration-300 ${locationAccess === true ? "bg-[#6367FF] border-[#6367FF] text-white" : "bg-white border-[#E2DCFF] text-gray-600 hover:border-[#6367FF]"}`}
                                >
                                    <Navigation size={16} />
                                    <span className="font-bold text-xs">{isLoadingLocation && locationAccess !== false ? "Locating..." : "Auto Precise"}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setLocationAccess(false);
                                        setCoordinates(null);
                                        onUpdate({
                                            latitude: null,
                                            longitude: null,
                                            city: manualCity,
                                            country: manualCountry
                                        });
                                    }}
                                    className={`flex-1 rounded-xl flex items-center justify-center gap-2 p-2.5 border-2 transition-all duration-300 ${locationAccess === false ? "bg-[#6367FF] border-[#6367FF] text-white" : "bg-white border-[#E2DCFF] text-gray-600 hover:border-[#6367FF]"}`}
                                >
                                    <Globe size={16} />
                                    <span className="font-bold text-xs">Manual Entry</span>
                                </button>
                            </div>
                        </div>

                        {(locationAccess === false || (locationAccess === true && coordinates)) && (
                            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white border border-[#E2DCFF] rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500 h-fit">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">City</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={locationAccess === false ? manualCity : (coordinates?.city || "")}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setManualCity(val);
                                                onUpdate({ city: val });
                                            }}
                                            readOnly={locationAccess === true}
                                            className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs transition-all ${locationAccess === true ? "opacity-70 cursor-not-allowed" : "focus:bg-white focus:border-[#6367FF]"}`}
                                            placeholder="Enter city..."
                                        />
                                        {locationAccess === true && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Country</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={locationAccess === false ? manualCountry : (coordinates?.country || "")}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setManualCountry(val);
                                                onUpdate({ country: val });
                                            }}
                                            readOnly={locationAccess === true}
                                            className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs transition-all ${locationAccess === true ? "opacity-70 cursor-not-allowed" : "focus:bg-white focus:border-[#6367FF]"}`}
                                            placeholder="Enter country..."
                                        />
                                        {locationAccess === true && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const Navigation = ({ size, className }: { size?: number; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
);
