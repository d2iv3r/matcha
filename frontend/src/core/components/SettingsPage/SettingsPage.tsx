"use client";

import { useState } from "react";
import { useProfile } from "@/core/contexts/ProfileContext";
import BasicInfo from "./BasicInfo";
import Gallery from "./Gallery";
import Security from "./Security";
import Blocked from "./Blocked";

export const SettingsPage = () => {
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
                "gender_preference",
                "interests",
            ];
            const hasProfileChanges = profileFields.some(
                (key) => key in pendingChanges,
            );
            const hasMediaChanges =
                "avatar" in pendingChanges || "allPictures" in pendingChanges;

            if (hasProfileChanges) {
                const profileDataToSave = Object.fromEntries(
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
                        body: JSON.stringify(profileDataToSave),
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
                    <div className="flex flex-row w-full md:w-fit z-10 text-xs md:text-sm whitespace-nowrap overflow-x-auto md:overflow-y-auto scrollbar-hide">
                        <button
                            onClick={() => setActiveTab("basic")}
                            className={`px-6 py-3 transition-colors text-center md:text-left ${activeTab === "basic" ? "border-b-2 border-[#6367FF] text-[#6367FF] bg-[#6367FF]/5" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50 hover:text-[#6367FF]/50"}`}
                        >
                            Basic Infos
                        </button>
                        <button
                            onClick={() => setActiveTab("gallery")}
                            className={`px-6 py-3 transition-colors text-center md:text-left ${activeTab === "gallery" ? "border-b-2 border-[#6367FF] text-[#6367FF] bg-[#6367FF]/5" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50 hover:text-[#6367FF]/50"}`}
                        >
                            Gallery
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`px-6 py-3 transition-colors text-center md:text-left ${activeTab === "security" ? "border-b-2 border-[#6367FF] text-[#6367FF] bg-[#6367FF]/5" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50 hover:text-[#6367FF]/50"}`}
                        >
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab("blocked")}
                            className={`px-6 py-3 transition-colors text-center md:text-left ${activeTab === "blocked" ? "border-b-2 border-[#6367FF] text-[#6367FF] bg-[#6367FF]/5" : "text-[#AEB0FF]/50 border-b-2 border-[#AEB0FF]/50 hover:text-[#6367FF]/50"}`}
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
                            {activeTab === "blocked" && <Blocked />}
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
};
