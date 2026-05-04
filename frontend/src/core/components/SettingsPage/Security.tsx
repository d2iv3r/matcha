"use client";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function Security() {
    const [locationAccess, setLocationAccess] = useState<boolean | null>(true);
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
                            onClick={() => {
                                setShowPassword(!showPassword);
                            }}
                            className="text-gray-400 hover:text-[#6367FF] transition-colors"
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
                                onClick={() => {
                                    setShowNewPassword(!showNewPassword);
                                }}
                                className="text-gray-400 hover:text-[#6367FF] transition-colors"
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
                            className={`flex flex-row items-center gap-2 px-3 py-[7px] bg-white border rounded-xl shadow-sm transition-all ${confirmPassword && newPassword !== confirmPassword ? "border-red-500" : confirmPassword && newPassword === confirmPassword ? "border-green-500 shadow-[#22c55e]/10" : "border-[#6367FF]"}`}
                        >
                            <Lock className="w-5 h-5 text-[#6367FF]" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="text-xs bg-transparent outline-none w-full placeholder-black/40"
                            />
                            <button
                                onClick={() => {
                                    setShowConfirmPassword(
                                        !showConfirmPassword,
                                    );
                                }}
                                className="text-gray-400 hover:text-[#6367FF] transition-colors"
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
                                    <p className="text-[10px] font-medium text-red-500 animate-in fade-in">
                                        Passwords do not match
                                    </p>
                                )}
                            {confirmPassword &&
                                newPassword === confirmPassword && (
                                    <p className="text-[10px] font-medium text-green-500 animate-in fade-in">
                                        Passwords match
                                    </p>
                                )}
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end mt-2">
                    <button
                        onClick={handlePasswordUpdate}
                        disabled={
                            isUpdating ||
                            !currentPassword ||
                            !newPassword ||
                            !confirmPassword ||
                            newPassword !== confirmPassword ||
                            score < 3
                        }
                        className={`bg-[#6367FF] text-white px-8 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#6367FF]/20 transition-all ${isUpdating || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || score < 3 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#555DFF] active:scale-95 cursor-pointer"}`}
                    >
                        {isUpdating ? (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                                Updating...
                            </div>
                        ) : (
                            "Update Password"
                        )}
                    </button>
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
