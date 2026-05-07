"use client";
import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { User, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            setErrorMsg("Username and password are required.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5001/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || "Login failed");
            }

            if (data.access_token) {
                localStorage.setItem("access_token", data.access_token);
            }
            if (data.data && data.data.username) {
                localStorage.setItem("username", data.data.username);
            }
            if (data.data) {
                localStorage.setItem(
                    "is_profile_complete",
                    data.data.is_profile_complete,
                );
            }
            if (!data.data.is_profile_complete) {
                router.push("/step1");
            } else {
                router.push("/home");
            }
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleIntraLogin = () => {
        window.location.href = "http://localhost:5001/api/auth/oauth2/42/login";
    };

    return (
        <div className="w-full h-screen flex items-center justify-center p-3 bg-transparent">
            <div className="w-full h-full max-w-[13f20px] flex flex-row">
                <div className="w-full h-full flex flex-col gap-10 p-6 flex-1">
                    <div className="flex justify-center lg:justify-start">
                        <a href="/marketing">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={140}
                                height={90}
                                priority
                                className="w-auto h-5 object-contain"
                            />
                        </a>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                        className="flex w-full max-w-[450px] flex-col gap-6 self-center text-sm"
                    >
                        <h1 className="pl-3 text-2xl font-bold">Login</h1>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <h3 className="pl-4 text-black">Username</h3>
                                <div className="flex flex-row items-center gap-4 p-3 bg-[#EDEDED] rounded-xl">
                                    <User />
                                    <input
                                        type="text"
                                        name="username"
                                        autoComplete="username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        placeholder="Username"
                                        className="bg-transparent outline-none w-full text-black placeholder-black/50"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="pl-4 text-black">Password</h3>
                                <div className="flex flex-row items-center gap-4 p-3 bg-[#EDEDED] rounded-xl">
                                    <LockKeyhole />
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="bg-transparent outline-none w-full text-black placeholder-black/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-2 ml-2">
                                <input type="checkbox" />
                                <p className="text-[#767676] text-xs">
                                    Remember me
                                </p>
                            </div>
                            {errorMsg && (
                                <p className="text-red-500 text-sm font-medium text-center">
                                    {errorMsg}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-center bg-[#6367FF] text-white py-3 rounded-xl font-bold cursor-pointer disabled:opacity-50 transition-opacity"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                            <div className="flex flex-col gap-1 ml-2 text-xs">
                                <div className="flex flex-row items-center gap-1">
                                    <p className="text-[#767676]">
                                        You don't have an account?
                                    </p>
                                    <a
                                        href="/sign-up"
                                        className="underline underline-offset-2"
                                    >
                                        Sign Up
                                    </a>
                                </div>
                                <a
                                    href="/forgot-password"
                                    className="underline underline-offset-2"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <div className="w-full flex flex-row items-center gap-4">
                                <hr className="w-full" />
                                <p className="text-xs whitespace-nowrap">
                                    or Login with
                                </p>
                                <hr className="w-full" />
                            </div>
                            <div
                                onClick={handleIntraLogin}
                                className="w-full h-full flex flex-row items-center justify-center gap-4 bg-gray-50 border border-[#EDEDED] hover:bg-gray-100 cursor-pointer p-2 rounded-xl"
                            >
                                <Image
                                    src="/42.png"
                                    alt="42"
                                    width={22}
                                    height={22}
                                    className="pt-1"
                                    unoptimized
                                />
                                <p className="text-sm font-medium whitespace-nowrap">
                                    Login with Intra 42
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="hidden lg:flex flex-1/4 w-full h-full flex-col bg-[url('/login-image.png')] bg-cover bg-center rounded-2xl p-6 text-white items-end justify-between">
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
