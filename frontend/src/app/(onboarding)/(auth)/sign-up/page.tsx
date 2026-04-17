"use client";
import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { User, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

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

    const handleSignUp = async () => {
        setErrorMsg("");
        if (!username || !firstName || !lastName || !email || !password) {
            setErrorMsg("All fields are required.");
            return;
        }
        if (score <= 2) {
            setErrorMsg("Please choose a stronger password.");
            return;
        }
        
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5001/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    password: password,
                    username: username
                })
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || data.message || "Sign up failed");
            }
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full h-screen flex items-center justify-center p-3 bg-transparent">
            <div className="w-full h-full max-w-[13f20px] flex flex-row">
                <div className="w-full h-full flex flex-col gap-10 p-6 flex-1">
                    <div className="flex flex-row items-center justify-center lg:justify-start gap-4 text-sm">
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
                    </div>
                    <div className="flex w-full max-w-[450px] flex-col gap-4 self-center text-sm">
                        <h1 className="pl-3 text-3xl font-bold text-center lg:text-left ">Sign Up</h1>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                                <h3 className="pl-4 text-black">Username</h3>
                                <div className="flex flex-row items-center gap-4 px-3 py-2 bg-[#EDEDED] rounded-lg">
                                    <User />
                                    <input
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-transparent outline-none w-full text-xs text-black placeholder-black/50"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <div className="flex flex-col gap-2 w-full">
                                    <h3 className="pl-4 text-black">
                                        First Name
                                    </h3>
                                    <div className="flex flex-row items-center gap-4 px-3 py-2 bg-[#EDEDED] rounded-lg">
                                        <User />
                                        <input
                                            type="text"
                                            placeholder="Enter your first name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="bg-transparent outline-none w-full text-xs text-black placeholder-black/50"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <h3 className="pl-4 text-black">
                                        Last Name
                                    </h3>
                                    <div className="flex flex-row items-center gap-4 px-3 py-2 bg-[#EDEDED] rounded-lg">
                                        <User />
                                        <input
                                            type="text"
                                            placeholder="Enter your last name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="bg-transparent outline-none w-full text-xs text-black placeholder-black/50"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="pl-4 text-black">Email</h3>
                                <div className="flex flex-row items-center gap-4 px-3 py-2 bg-[#EDEDED] rounded-lg">
                                    <Mail />
                                    <input
                                        type="text"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-transparent outline-none w-full text-xs text-black placeholder-black/50"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="pl-4 text-black">Password</h3>
                                <div className="flex flex-row items-center gap-4 px-3 py-2 bg-[#EDEDED] rounded-lg">
                                    <LockKeyhole />
                                    <input
                                        type="text"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="bg-transparent outline-none w-full text-xs text-black placeholder-black/50"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 px-1">
                                {password && (
                                    <p
                                        className={`text-xs font-medium h-5 transition-colors duration-300 ${
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
                                <p className="text-[10px] font-medium text-black/30">
                                    8+ characters including a special character
                                    (like @, #, $).
                                </p>
                            </div>

                            {/* Error Message */}
                            {errorMsg && (
                                <p className="text-red-500 text-sm font-medium text-center">{errorMsg}</p>
                            )}

                            <button
                                type="button"
                                onClick={handleSignUp}
                                disabled={loading}
                                className="w-full self-center bg-[#6367FF] text-white py-3 rounded-xl font-bold mt-4 disabled:opacity-50 transition-opacity"
                            >
                                {loading ? "Signing up..." : "Sign up"}
                            </button>
                            <div className="flex flex-col gap-1 ml-2 text-xs">
                                <div className="flex flex-row flex-wrap items-center gap-1 text-black/25">
                                    <p className="text-[#767676]">
                                        By continuing, you accept the
                                    </p>
                                    <a
                                        href="/terms-of-use"
                                        className="text-[#6367FF] underline underline-offset-2"
                                    >
                                        Terms of Use
                                    </a>
                                    <p className="text-[#767676]">and</p>
                                    <a
                                        href="/confidentiality"
                                        className="text-[#6367FF] underline underline-offset-2"
                                    >
                                        Confidentiality Policy
                                    </a>
                                </div>
                                <div className="flex flex-row flex-wrap items-center gap-1">
                                    <p className="text-[#767676]">
                                        You have already an account?
                                    </p>
                                    <a
                                        href="/login"
                                        className="underline underline-offset-2"
                                    >
                                        Login
                                    </a>
                                </div>
                            </div>
                            <div className="w-full flex flex-row items-center gap-4">
                                <hr className="w-full" />
                                <p className="text-xs whitespace-nowrap">
                                    or Sign up with
                                </p>
                                <hr className="w-full" />
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <div className="w-full h-full flex flex-row items-center justify-center gap-2 bg-[#EDEDED] p-3 rounded-xl">
                                    <p className="text-sm whitespace-nowrap">
                                        Google
                                    </p>
                                </div>
                                <div className="w-full h-full flex flex-row items-center justify-center gap-2 bg-[#EDEDED] p-3 rounded-xl">
                                    <p className="text-sm whitespace-nowrap">
                                        Intra 42
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1/4 hidden lg:flex w-full h-full flex-col bg-[url('/signup-image.png')] bg-cover bg-center rounded-2xl p-6 text-white items-end justify-between">
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
