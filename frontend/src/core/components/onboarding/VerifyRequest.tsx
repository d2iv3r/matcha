"use client";

import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { MoveLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyRequest() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "this email";
    const [isResending, setIsResending] = useState(false);
    const [resendStatus, setResendStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Mask the email like ab***@gmail.com if it's a valid email, else just use the string
    const getMaskedEmail = (e: string) => {
        const parts = e.split("@");
        if (parts.length === 2) {
            const name = parts[0];
            const domain = parts[1];
            if (name.length > 2) {
                return `${name.slice(0, 2)}***@${domain}`;
            }
            return `${name}***@${domain}`;
        }
        return e;
    };

    const handleResend = async () => {
        if (!email || email === "this email") return;
        setIsResending(true);
        setResendStatus(null);

        try {
            const res = await fetch("http://localhost:5001/api/auth/reset-password/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setResendStatus({ type: "success", message: "Email resent successfully!" });
            } else {
                const data = await res.json();
                setResendStatus({ type: "error", message: data.message || "Failed to resend email." });
            }
        } catch (err) {
            setResendStatus({ type: "error", message: "An error occurred. Please try again." });
        } finally {
            setIsResending(false);
        }
    };

    const the_email = getMaskedEmail(email);

    return (
        <div className="w-full h-screen flex items-center justify-center p-3 bg-white">
            <div className="w-full h-full max-w-[13f20px] flex flex-row">
                <div className="w-full h-full flex flex-col gap-10 p-6 flex-1">
                    <a href="/">
                        <Image
                            src={logo}
                            alt="Logo"
                            priority={true}
                            width={140}
                            height={140}
                            className="w-35 h-10"
                        />
                    </a>
                    <div className="flex w-full max-w-[450px] flex-col gap-6 self-center text-sm">
                        <h1 className="pl-3 text-2xl font-bold">
                            Verify your email address
                        </h1>
                        <h4 className="pl-3 font-medium">
                            We sent an email to{" "}
                            <span className="font-bold">{the_email}</span>{" "}
                            please check your inbox and spam folder.
                            <div className="text-sm font-medium mt-1">
                                If you didn't receive an email, resend it again.
                            </div>
                        </h4>
                        
                        {resendStatus && (
                            <div
                                className={`px-4 py-3 rounded-xl text-xs font-semibold ${
                                    resendStatus.type === "success"
                                        ? "bg-green-50 text-green-600"
                                        : "bg-red-50 text-red-500"
                                }`}
                            >
                                {resendStatus.message}
                            </div>
                        )}

                        <div className="flex flex-col gap-6">
                            <button
                                onClick={handleResend}
                                disabled={isResending}
                                className={`w-full flex items-center justify-center text-white py-3 rounded-xl font-bold transition-colors ${
                                    isResending ? "bg-[#6367FF]/60 cursor-not-allowed" : "bg-[#6367FF] hover:bg-[#6367FF]/90 cursor-pointer"
                                }`}
                            >
                                {isResending ? "Sending..." : "Resend Email"}
                            </button>
                            <a
                                href="/login"
                                className="w-full flex flex-row items-center justify-center gap-3 border border-gray-200 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                            >
                                <MoveLeft size={18}/>
                                Back to Login
                            </a>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:flex flex-1/4 w-full h-full flex-col bg-[url('/forget-pass-image.png')] bg-cover bg-center rounded-2xl p-6 text-white items-end justify-between">
                    <div className="flex flex-row items-center gap-4 text-sm">
                        <a
                            href="/login"
                            className="font-extrabold underline underline-offset-4"
                        >
                            LOGIN
                        </a>
                        <a href="/sign-up" className="font-medium hover:underline hover:underline-offset-4 transition-all">
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
