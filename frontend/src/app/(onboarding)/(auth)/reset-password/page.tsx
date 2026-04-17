"use client";

import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import bg from "@/public/login-image.png";
import { LockKeyhole, MoveLeft } from "lucide-react";
import { useState } from "react";

export default function ResetPassword(emaila: string) {
    const email = "abdellah.elkacem@gmail.com";
    const [password, setPassword] = useState("");

    const the_email = email.slice(0, 2) + "*****" + email.slice(-11);

    const getPasswordScore = (pass: string) => {
        let score = 0;
        if (pass.length > 5) score += 1;
        if (pass.length > 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    const score = getPasswordScore(password);

    const getStrengthColor = () => {
        if (!password) return "bg-[#EDEDED]";
        if (score <= 2) return "bg-red-500";
        if (score <= 4) return "bg-orange-500";
        return "bg-green-500";
    };

    const getStrengthText = () => {
        if (!password) return "";
        if (score <= 2) return "Bad Password";
        if (score <= 4) return "Medium Password";
        return "Strong Password";
    };

    const strengthColor = getStrengthColor();

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
                            Reset your password
                        </h1>
                        <h4 className="pl-3 font-medium">
                            Enter your new password.
                        </h4>
                        <div className="flex flex-col gap-2">
                            <h3 className="pl-4 text-black">Password</h3>
                            <div className="flex flex-row items-center gap-4 p-3 bg-[#EDEDED] rounded-xl">
                                <LockKeyhole />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="bg-transparent outline-none w-full text-black placeholder-black/50"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 px-1">
                            {password && (
                                <p
                                    className={`text-sm font-medium h-5 transition-colors duration-300 ${
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
                            <div className="flex gap-2 w-full h-1">
                                <div
                                    className={`flex-1 rounded-full transition-all duration-300 ${password ? strengthColor : "bg-[#EDEDED]"}`}
                                ></div>
                                <div
                                    className={`flex-1 rounded-full transition-all duration-300 ${score > 2 ? strengthColor : "bg-[#EDEDED]"}`}
                                ></div>
                                <div
                                    className={`flex-1 rounded-full transition-all duration-300 ${score > 4 ? strengthColor : "bg-[#EDEDED]"}`}
                                ></div>
                            </div>
                            <p className="text-xs font-medium text-black/30">
                                8+ characters including a special character
                                (like @, #, $).
                            </p>
                        </div>
                        <div className="flex flex-col gap-6">
                            <a
                                href="/back-login"
                                className="w-full flex items-center justify-center bg-[#6367FF] text-white py-3 rounded-xl font-bold"
                            >
                                Finish
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex-1/4 w-full h-full flex flex-col bg-[url('/forget-pass-image.png')] bg-cover bg-center rounded-2xl p-6 text-white items-end justify-between">
                    <div className="flex flex-row items-center gap-4 text-sm">
                        <a
                            href="/login"
                            className="font-extrabold underline underline-offset-4"
                        >
                            LOGIN
                        </a>
                        <a href="/sign-up" className="font-medium">
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
