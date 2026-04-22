"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "@/public/logomatchvibe.svg";
import { Mail, MoveLeft } from "lucide-react";

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:5001/api/auth/reset-password/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to process request");
            }

            // Redirect to a check your email page 
            router.push(`/verify-request?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            console.error("Forgot password error:", err);
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center p-3 bg-white">
            <div className="w-full h-full max-w-[13f20px] flex flex-row">
                <div className="w-full h-full flex flex-col gap-10 p-6 flex-1">
                    <div className="flex justify-center lg:justify-start">
                        <Image
                            src={logo}
                            alt="Logo"
                            priority={true}
                            width={140}
                            height={140}
                            className="w-35 h-10"
                        />
                    </div>
                    <form onSubmit={handleReset} className="flex w-full max-w-[450px] flex-col gap-5 self-center text-sm">
                        <h1 className="pl-3 text-2xl font-bold">
                            Recovery your Password
                        </h1>
                        
                        {error && (
                            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-xs font-semibold">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h3 className="pl-4 text-black">Email</h3>
                                <div className="flex flex-row items-center gap-4 p-3 bg-[#EDEDED] rounded-xl focus-within:ring-2 focus-within:ring-[#6367FF]/50 transition-all">
                                    <Mail />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-transparent outline-none w-full text-black placeholder-black/50"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center text-white py-3 rounded-xl font-bold transition-colors ${isLoading ? "bg-[#6367FF]/60 cursor-not-allowed" : "bg-[#6367FF] hover:bg-[#6367FF]/90"}`}
                            >
                                {isLoading ? "Sending..." : "Next"}
                            </button>
                            <a
                                href="/login"
                                className="w-full flex flex-row items-center justify-center gap-3 border border-gray-200 py-2 rounded-xl font-bold hover:bg-gray-50 transition-colors text-black"
                            >
                                <MoveLeft size={18} />
                                Back to Login
                            </a>
                        </div>
                    </form>
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
