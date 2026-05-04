"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProfile } from "@/core/contexts/ProfileContext";
import MatchOverlay from "@/core/constants/MatchOverlay";
import MyProfileView from "./MyProfileView";
import OtherProfileView from "./OtherProfileView";
import { ApiProfile } from "@/core/types/profiles";

export default function ProfilePage() {
    const { profile_username } = useParams();
    const { profile: myProfile, isLoading: isMyProfileLoading } = useProfile();

    // UI state
    const [activeTab, setActiveTab] = useState<"gallery" | "viewers" | "liked">(
        "gallery",
    );
    const [profileData, setProfileData] = useState<ApiProfile | null>(null);
    const [viewers, setViewers] = useState<ApiProfile[]>([]);
    const [likers, setLikers] = useState<ApiProfile[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isMatch, setIsMatch] = useState(false);
    const [matchModal, setMatchModal] = useState<{
        isOpen: boolean;
        user: ApiProfile | null;
    }>({
        isOpen: false,
        user: null,
    });
    const router = useRouter();

    const isOwner = myProfile?.profile?.username === profile_username;

    const hasFetched = useRef(false);

    // Main profile fetch
    useEffect(() => {
        if (!profile_username || isMyProfileLoading) return;
        if (hasFetched.current) return;

        if (isOwner && myProfile) {
            setProfileData(myProfile.profile);
            setIsFetching(false);
            hasFetched.current = true;
        } else if (!isOwner) {
            setIsFetching(true);
            hasFetched.current = true;
            fetch(
                `http://localhost:5001/api/v1/accounts/profile/${profile_username}`,
                { credentials: "include" },
            )
                .then((res) => {
                    if (!res.ok) throw new Error("Fetch failed");
                    return res.json();
                })
                .then((result) => {
                    if (result.success) {
                        setProfileData(result.data.profile);
                        setIsLiked(
                            result.data.is_liked || result.data.is_match,
                        );
                        setIsMatch(result.data.is_match);
                    } else {
                        setProfileData(null);
                    }
                })
                .catch((err) => {
                    console.error("Profile fetch error:", err);
                    setProfileData(null);
                    hasFetched.current = false; // Allow retry on error
                })
                .finally(() => setIsFetching(false));
        }
    }, [profile_username, isOwner, myProfile, isMyProfileLoading]);

    // Owner specific tabs fetch
    useEffect(() => {
        if (!isOwner) return;

        if (activeTab === "viewers") {
            setIsFetching(true);
            fetch("http://localhost:5001/api/v1/profile/viewers", {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.success) setViewers(result.data.viewers || []);
                })
                .finally(() => setIsFetching(false));
        } else if (activeTab === "liked") {
            setIsFetching(true);
            fetch("http://localhost:5001/api/v1/profile/likes", {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.success) setLikers(result.data.likers || []);
                })
                .finally(() => setIsFetching(false));
        }
    }, [activeTab, isOwner]);

    if (isFetching && !profileData) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6367FF]"></div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500 font-medium">Profile not found</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-4 overflow-y-auto scrollbar-hide">
            {!isOwner && profileData ? (
                <OtherProfileView
                    profileData={profileData}
                    isLiked={isLiked}
                    setIsLiked={setIsLiked}
                    isMatch={isMatch}
                    setIsMatch={setIsMatch}
                    onMatch={(u: ApiProfile) =>
                        setMatchModal({ isOpen: true, user: u })
                    }
                />
            ) : (
                <MyProfileView
                    profileData={profileData}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    viewers={viewers}
                    setViewers={setViewers}
                    likers={likers}
                    setLikers={setLikers}
                    onMatch={(u: ApiProfile) =>
                        setMatchModal({ isOpen: true, user: u })
                    }
                />
            )}

            <MatchOverlay
                isOpen={matchModal.isOpen}
                onClose={() => setMatchModal({ isOpen: false, user: null })}
                myAvatar={myProfile?.profile?.avatar || null}
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
