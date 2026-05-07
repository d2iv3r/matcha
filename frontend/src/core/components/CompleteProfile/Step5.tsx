"use client";
import { useRouter } from "next/navigation";
import { Check, Wallpaper, X, Plus, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Step5() {
    const router = useRouter();
    const [images, setImages] = useState<{ file: File; url: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [oauthAvatar, setOauthAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("profile_data") || "{}");
        if (data.oauth === "intra42" && data.avatar) {
            setOauthAvatar(data.avatar);
        }
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        let validFiles = files.filter((file) => {
            if (file.size > 3 * 1024 * 1024) {
                alert(`File ${file.name} is larger than 3MB.`);
                return false;
            }
            if (!file.type.startsWith("image/")) {
                alert(`File ${file.name} is not an image.`);
                return false;
            }
            return true;
        });

        if (images.length + validFiles.length > 5) {
            alert("You can only upload up to 5 photos.");
            validFiles = validFiles.slice(0, 5 - images.length);
        }

        const newImages = validFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...newImages]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };
    const handleFinish = async () => {
        setIsSubmitting(true);
        setErrorMsg("");

        try {
            const dataStr = localStorage.getItem("profile_data");
            const existingData = JSON.parse(dataStr || "{}");

            const formData = new FormData();
            if (existingData.gender)
                formData.append("gender", existingData.gender);
            if (existingData.gender_preference)
                formData.append(
                    "gender_preference",
                    existingData.gender_preference,
                );
            if (existingData.date_of_birth)
                formData.append("date_of_birth", existingData.date_of_birth);
            if (existingData.bio) formData.append("bio", existingData.bio);

            // Location fields
            if (existingData.city) formData.append("city", existingData.city);
            if (existingData.country)
                formData.append("country", existingData.country);
            if (existingData.ip_address)
                formData.append("ip_address", existingData.ip_address);
            if (existingData.latitude !== undefined)
                formData.append("latitude", String(existingData.latitude));
            if (existingData.longitude !== undefined)
                formData.append("longitude", String(existingData.longitude));
            if (existingData.is_location_approved !== undefined)
                formData.append(
                    "is_location_approved",
                    String(existingData.is_location_approved),
                );

            if (
                existingData.interests &&
                Array.isArray(existingData.interests)
            ) {
                existingData.interests.forEach((interest: string) => {
                    formData.append("interests", interest);
                });
            }

            if (oauthAvatar) {
                formData.append("avatar", oauthAvatar);
                // If we have an oauth avatar, all uploaded images are treated as secondary pictures
                images.forEach((img) => formData.append("pictures", img.file));
            } else {
                if (images.length > 0) {
                    formData.append("avatar", images[0].file);
                }
                for (let i = 1; i < images.length; i++) {
                    formData.append("pictures", images[i].file);
                }
            }

            const res = await fetch(
                "http://localhost:5001/api/v1/accounts/complete-profile",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                },
            );

            const responseData = await res.json();

            if (!res.ok) {
                const errMsg =
                    responseData.error ||
                    responseData.message ||
                    (responseData.errors
                        ? JSON.stringify(responseData.errors)
                        : "Failed to complete profile.");
                throw new Error(errMsg);
            }

            localStorage.removeItem("profile_data");
            router.push("/step6");
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitting) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center p-6 gap-4">
                <Loader2 className="animate-spin text-[#6367FF]" size={48} />
                <p className="font-medium text-[#4B4B4B]">
                    Setting up your profile...
                </p>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col gap-4 items-center justify-between p-6">
            <div className="relative w-full flex flex-row gap-4 justify-between items-center mb-2">
                <div className="absolute w-full h-[3px] bg-[#6367FF]" />
                <div className="w-full flex flex-row gap-4 justify-between z-10">
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 rounded-full border-[3px] bg-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        <Check size={20} color="white" strokeWidth={3} />
                    </div>
                    <div className="w-8 h-8 bg-[#FFF0FE] rounded-full border-[3px] border-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        5
                    </div>
                </div>
            </div>
            <div className="w-full flex-2 gap-2 flex flex-col px-3">
                <p className="text-md font-extrabold text-[#4B4B4B] mb-1">
                    Step 5 of 5
                </p>
                <h1 className="text-2xl font-medium">Complete your profile</h1>
                <p className="text-black/50 text-sm mb-2">
                    A picture is worth a thousand words. Upload up to 5 photos
                    to show your personality.
                </p>

                {errorMsg && (
                    <div className="w-full p-3 bg-red-100 text-red-600 rounded-lg text-sm mb-2 text-center">
                        {errorMsg}
                    </div>
                )}

                <div className="w-full flex items-center flex-col gap-3 bg-[#E2DCFF] rounded-2xl p-4">
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg, image/png"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    {/* Upload header */}
                    <div
                        className="flex flex-col justify-center items-center py-1 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Wallpaper size={28} className="mb-2 text-[#4B4B4B]" />
                        <p className="text-xs font-medium text-[#4B4B4B]">
                            Choose a file, jpeg and png formats up to 3MB
                        </p>
                    </div>

                    {/* Primary uploaded file or OAuth avatar */}
                    {oauthAvatar ? (
                        <div className="w-full h-[88px] flex items-center justify-between p-3 border border-[#6367FF] rounded-xl bg-transparent">
                            <div className="flex items-center gap-4 w-full h-full overflow-hidden">
                                <div
                                    className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0"
                                    style={{
                                        backgroundImage: `url(${oauthAvatar})`,
                                    }}
                                />
                                <div className="flex flex-col gap-1 overflow-hidden h-full justify-center w-[calc(100%-80px)]">
                                    <p className="font-semibold text-sm truncate">
                                        Profile Picture (from 42)
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-[#C6BAFF] text-[10px] font-semibold rounded-md uppercase">
                                            42 Intra
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : images[0] ? (
                        <div className="w-full h-[88px] flex items-center justify-between p-3 border border-[#6367FF] rounded-xl bg-transparent">
                            <div className="flex items-center gap-4 w-full h-full overflow-hidden">
                                <div
                                    className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0"
                                    style={{
                                        backgroundImage: `url(${images[0].url})`,
                                    }}
                                />
                                <div className="flex flex-col gap-1 overflow-hidden h-full justify-center w-[calc(100%-80px)]">
                                    <p className="font-semibold text-sm truncate">
                                        {images[0].file.name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-[#C6BAFF] text-[10px] font-semibold rounded-md uppercase">
                                            {images[0].file.type.split(
                                                "/",
                                            )[1] || "JPEG"}
                                        </span>
                                        <span className="text-xs text-black/50 font-medium">
                                            {(
                                                images[0].file.size /
                                                (1024 * 1024)
                                            ).toFixed(1)}{" "}
                                            MB
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <X
                                size={20}
                                className="text-black cursor-pointer shrink-0 ml-2"
                                onClick={() => removeImage(0)}
                            />
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-[88px] rounded-xl border-2 border-dashed border-[#8E90FF] flex items-center justify-center cursor-pointer"
                        >
                            <Plus
                                size={32}
                                className="text-[#6367FF]"
                                strokeWidth={2.5}
                            />
                        </div>
                    )}

                    {/* Secondary files grid */}
                    <div className="w-full flex flex-col md:flex-row gap-3 mt-1 h-[300px] md:h-[150px]">
                        {[1, 2, 3, 4].map((slotIndex, index) => {
                            // If we have an oauthAvatar, images[0] is the first secondary picture (slotIndex 1)
                            // If we don't have an oauthAvatar, images[1] is the first secondary picture (slotIndex 1)
                            const imageIndex = oauthAvatar
                                ? slotIndex - 1
                                : slotIndex;
                            const image = images[imageIndex];
                            if (image) {
                                return (
                                    <div
                                        key={`${slotIndex}-${index}`}
                                        className="flex-1 min-w-0 rounded-xl border border-[#6367FF] bg-transparent flex flex-col p-1.5 cursor-pointer"
                                    >
                                        <div
                                            className="w-full flex-1 rounded-lg bg-cover bg-center mb-1"
                                            style={{
                                                backgroundImage: `url(${image.url})`,
                                            }}
                                        />
                                        <div className="flex justify-between items-center px-1">
                                            <p className="text-[10px] font-semibold truncate leading-tight flex-1 mr-1">
                                                {image.file.name}
                                            </p>
                                            <X
                                                size={12}
                                                className="cursor-pointer shrink-0"
                                                onClick={() =>
                                                    removeImage(imageIndex)
                                                }
                                            />
                                        </div>
                                        <p className="text-[10px] text-black/50 font-medium px-1 leading-none pb-0.5">
                                            {(
                                                image.file.size /
                                                (1024 * 1024)
                                            ).toFixed(1)}{" "}
                                            MB
                                        </p>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={slotIndex}
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="flex-1 rounded-xl border-2 border-dashed border-[#8E90FF] flex items-center justify-center cursor-pointer"
                                    >
                                        <Plus
                                            size={32}
                                            className="text-[#6367FF]"
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row gap-7">
                <button
                    onClick={() => {
                        router.push("/step4");
                    }}
                    className="w-full flex-1 flex flex-col items-center justify-center p-3 border rounded-2xl"
                >
                    <p className="font-semibold text-black/50">Back</p>
                </button>
                <button
                    disabled={!oauthAvatar && images.length === 0}
                    onClick={handleFinish}
                    className="w-full flex-2 flex flex-col items-center justify-center p-3 bg-[#6367FF] rounded-2xl disabled:opacity-50"
                >
                    <p className="font-semibold text-white">Finish</p>
                </button>
            </div>
        </div>
    );
}
