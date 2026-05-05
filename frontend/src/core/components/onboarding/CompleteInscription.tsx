"use client";
import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteInscription() {
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const token = params.get("token");

                if (!token) {
                    setStatus("error");
                    setErrorMessage("No verification token provided in the URL.");
                    return;
                }

                // The backend route is configured as a GET request that takes the token as a query parameter
                const res = await fetch(`http://localhost:5001/api/auth/verify-email?token=${token}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                
                const data = await res.json();
                
                if (!res.ok || !data.success) {
                    throw new Error(data.error || data.message || "Failed to verify email");
                }
                
                setStatus("success");
            } catch (err: any) {
                setStatus("error");
                setErrorMessage(err.message || "An error occurred during verification.");
            }
        };

        verifyEmail();
    }, []);

    return (
        <div className="w-full h-screen flex items-center justify-center p-3 bg-white">
            <div className="w-full h-full max-w-[13f20px] flex flex-row">
                <div className="w-full h-full flex flex-col gap-10 p-6 flex-1">
                    <div className="flex justify-center lg:justify-start">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={140}
                            height={90}
                            priority
                            className="w-auto h-5 object-contain"
                        />
                    </div>
                    <div className="flex w-full max-w-[450px] flex-col gap-6 self-center text-sm">
                        {status === "loading" && (
                            <div className="flex flex-col items-center justify-center py-10 gap-4">
                                <Loader2 className="w-10 h-10 animate-spin text-[#6367FF]" />
                                <h1 className="text-xl font-bold">Verifying your email...</h1>
                            </div>
                        )}

                        {status === "success" && (
                            <>
                                <h1 className="pl-3 text-2xl font-bold">You’re In!</h1>
                                <h4 className="pl-3 font-medium text-black/50 w-[85%]">
                                    Verification successful. Now that the door is open,
                                    let’s make sure your profile shines so you can
                                    maximize every opportunity.
                                </h4>
                                <div className="flex flex-col gap-6">
                                    <a
                                        href="/login"
                                        className="w-full flex items-center justify-center bg-[#6367FF] text-white py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
                                    >
                                        Back to Login
                                    </a>
                                </div>
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <h1 className="pl-3 text-2xl font-bold text-red-500">Verification Failed</h1>
                                <h4 className="pl-3 font-medium text-black/50 w-[85%]">
                                    {errorMessage}
                                </h4>
                                <div className="flex flex-col gap-6">
                                    <a
                                        href="/sign-up"
                                        className="w-full flex items-center justify-center bg-[#6367FF] text-white py-3 rounded-xl font-bold"
                                    >
                                        Back to Sign Up
                                    </a>
                                    <a
                                        href="/login"
                                        className="w-full flex flex-row items-center justify-center gap-3 border py-2 rounded-xl font-bold"
                                    >
                                        Go to Login
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="hidden lg:flex flex-1/4 w-full h-full flex-col bg-[url('/signup-image.png')] bg-cover bg-center rounded-2xl p-6 text-white items-end justify-between">
                    <div className="flex flex-row items-center gap-4 text-sm">
                        <a href="/login" className="font-medium">
                            LOGIN
                        </a>
                        <a
                            href="/sign-up"
                            className="font-extrabold underline underline-offset-4"
                        >
                            SIGN UP
                        </a>
                    </div>
                    <p className="text-sm -mb-2">
                        Photo by{" "}
                        <span className="font-bold underline underline-offset-2">
                            @Unsplash
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
