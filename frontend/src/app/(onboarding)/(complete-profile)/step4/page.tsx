"use client";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const [locationAccess, setLocationAccess] = useState<boolean | null>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number; city: string; country: string; ip: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSettingsPrompt, setShowSettingsPrompt] = useState(false);

    const fetchIpLocation = async () => {
        const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
        if (!res.ok) throw new Error("Failed to fetch IP location");
        return await res.json();
    };

    const handleApprove = async () => {
        setIsLoading(true);

        try {
            const ipData = await fetchIpLocation();

            if (!navigator.geolocation) {
                setCoordinates({
                    lat: parseFloat(ipData.latitude),
                    lng: parseFloat(ipData.longitude),
                    city: ipData.city || "",
                    country: ipData.country || "",
                    ip: ipData.ip || "",
                });
                setLocationAccess(true);
                setIsLoading(false);
                return;
            }

            if (navigator.permissions && navigator.permissions.query) {
                try {
                    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
                    if (permissionStatus.state === 'denied') {
                        // User permanently blocked location! Show the settings prompt popup
                        setShowSettingsPrompt(true);
                        setIsLoading(false);
                        return; 
                    }
                } catch (e) {
                    // Ignore permissions api mismatch
                }
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        city: ipData.city || "",
                        country: ipData.country || "",
                        ip: ipData.ip || "",
                    });
                    setLocationAccess(true);
                    setIsLoading(false);
                },
                (error) => {
                    // Error code 1 means Permission Denied (either clicked block or HTTP/insecure blocked)
                    if (error.code === 1 || error.code === 2) {
                        setShowSettingsPrompt(true);
                    } else {
                        setCoordinates({
                            lat: parseFloat(ipData.latitude),
                            lng: parseFloat(ipData.longitude),
                            city: ipData.city || "",
                            country: ipData.country || "",
                            ip: ipData.ip || "",
                        });
                        setLocationAccess(true); 
                    }
                    setIsLoading(false);
                }
            );
        } catch (error) {
            console.error("Critical failure resolving location block:", error);
            setLocationAccess(true);
            setIsLoading(false);
        }
    };

    const handleDecline = async () => {
        setIsLoading(true);
        try {
            const ipData = await fetchIpLocation();
            setCoordinates({
                lat: parseFloat(ipData.latitude),
                lng: parseFloat(ipData.longitude),
                city: ipData.city || "",
                country: ipData.country || "",
                ip: ipData.ip || "",
            });
            setLocationAccess(false);
        } catch (error) {
            console.error("IP Geo error on decline:", error);
            setLocationAccess(false); 
        } finally {
            setIsLoading(false);
        }
    };

    const runFallbackIPLocation = async () => {
        setShowSettingsPrompt(false);
        setIsLoading(true);
        try {
            const ipData = await fetchIpLocation();
            setCoordinates({
                lat: parseFloat(ipData.latitude),
                lng: parseFloat(ipData.longitude),
                city: ipData.city || "",
                country: ipData.country || "",
                ip: ipData.ip || "",
            });
            // Mark as true so 'Approve' is selected because they accepted the fallback via the prompt
            setLocationAccess(true);
        } catch(e) {
            setLocationAccess(true);
        } finally {
            setIsLoading(false);
        }
    };

    console.log("coordinates :::: ",coordinates);

    return (
        <div className="h-full w-full flex flex-col gap-4 items-center justify-between p-6 relative">
            
            {showSettingsPrompt && (
                <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 rounded-xl">
                    <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 w-full max-w-[340px] shadow-2xl">
                        <h3 className="text-xl font-bold text-black border-b pb-2">Location Blocked</h3>
                        <p className="text-[13px] text-black/70 leading-relaxed font-semibold">
                            Your browser settings are currently blocking location access. To provide precise GPS coordinates, please click the <b>Tune/Lock icon</b> next to your URL bar, switch Location to <b>Allow</b>, and refresh the page.
                        </p>
                        <div className="flex flex-col gap-2 mt-2">
                            <button 
                                onClick={() => setShowSettingsPrompt(false)}
                                className="w-full py-2.5 rounded-xl border-2 border-black text-black font-bold hover:bg-black/5 transition-colors"
                            >
                                Cancel and Retry
                            </button>
                            <button 
                                onClick={runFallbackIPLocation}
                                className="w-full py-2.5 rounded-xl bg-[#6367FF] text-white font-bold hover:bg-[#6367FF]/90 transition-colors"
                            >
                                Use Approximate Location
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    <div className="w-8 h-8 bg-[#FFF0FE] rounded-full border-[3px] border-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        4
                    </div>
                    <div className="w-8 h-8 bg-[#FFF0FE] rounded-full border-[3px] border-[#6367FF] flex items-center justify-center text-[#6367FF] font-extrabold">
                        5
                    </div>
                </div>
            </div>
            <div className="w-full flex-2 gap-2 flex flex-col px-3">
                <p className="text-md font-extrabold text-[#4B4B4B] mb-1">
                    Step 4 of 5
                </p>
                <h1 className="text-xl sm:text-2xl font-medium">
                    Complete your profile
                </h1>
                <p className="text-black/50 text-xs sm:text-sm mb-3">
                    Help us find your match in the right neighborhood. We’ll use
                    your location to show you nearby soulmates while keeping
                    your exact address private.
                </p>
                <div className="w-full flex gap-2 flex-col">
                    <p className="pl-3 text-sm">Allow location access ?</p>
                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full h-[150px] bg-[url('/map-image.png')] rounded-2xl bg-cover bg-center border border-[#6367FF]" />
                        <div className="w-full flex flex-row gap-5">
                            <button
                                onClick={handleApprove}
                                disabled={isLoading || showSettingsPrompt}
                                className={`w-full rounded-xl flex items-center justify-center px-3 py-2 border border-[#6367FF] transition-colors duration-300 ${
                                    locationAccess === true
                                        ? "bg-[#6367FF] text-white cursor-pointer"
                                        : isLoading ? "bg-[#E2DCFF]/50 cursor-not-allowed text-black/50" : "bg-[#E2DCFF] cursor-pointer text-black"
                                }`}
                            >
                                <p className="font-semibold">{isLoading && locationAccess !== false && !showSettingsPrompt ? "Loading..." : "Approve"}</p>
                            </button>
                            <button
                                onClick={handleDecline}
                                disabled={isLoading || showSettingsPrompt}
                                className={`w-full rounded-xl flex items-center justify-center px-3 py-2 border border-[#6367FF] transition-colors duration-300 ${
                                    locationAccess === false
                                        ? "bg-[#6367FF] text-white cursor-pointer"
                                        : isLoading ? "bg-[#E2DCFF]/50 cursor-not-allowed text-black/50" : "bg-[#E2DCFF] cursor-pointer text-black"
                                }`}
                            >
                                <p className="font-semibold">{isLoading && locationAccess === false && !showSettingsPrompt ? "Loading..." : "Decline"}</p>
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-black/50">
                        You can change your location anytime in settings
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-row gap-7">
                <button
                    onClick={() => {
                        router.push("/step3");
                    }}
                    className="w-full flex-1 flex flex-col items-center justify-center p-3 border rounded-2xl cursor-pointer"
                >
                    <p className="font-semibold text-black/50">Back</p>
                </button>
                <button
                    disabled={locationAccess === null || isLoading || showSettingsPrompt}
                    onClick={() => {
                        const existingData = JSON.parse(
                            localStorage.getItem("profile_data") || "{}",
                        );
                        localStorage.setItem(
                            "profile_data",
                            JSON.stringify({
                                ...existingData,
                                location_access: locationAccess ? "true" : "false",
                                latitude: coordinates?.lat,
                                longitude: coordinates?.lng,
                                city: coordinates?.city,
                                country: coordinates?.country,
                                ip_address: coordinates?.ip
                            }),
                        );
                        router.push("/step5");
                    }}
                    className={`w-full flex-2 flex flex-col items-center justify-center p-3 rounded-2xl transition-colors duration-300 ${
                        locationAccess !== null && !isLoading && !showSettingsPrompt
                            ? "bg-[#6367FF] text-white cursor-pointer"
                            : "bg-[#E2DCFF] text-black/50 cursor-not-allowed"
                    }`}
                >
                    <p
                        className={`font-semibold ${locationAccess !== null && !isLoading && !showSettingsPrompt ? "text-white" : "text-black/50"}`}
                    >
                        Next
                    </p>
                </button>
            </div>
        </div>
    );
}
