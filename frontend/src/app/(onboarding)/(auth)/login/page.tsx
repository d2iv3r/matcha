"use client";
import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import bg from "@/public/login-image.png";
import { User, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";

export default function Login() {
    return (
        <div className="w-full h-screen flex items-center justify-center p-3 bg-transparent">
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
                        <h1 className="pl-3 text-2xl font-bold">Login</h1>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <h3 className="pl-4 text-black">Username</h3>
                                <div className="flex flex-row items-center gap-4 p-3 bg-[#EDEDED] rounded-xl">
                                    <User />
                                    <input
                                        type="text"
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
                                        type="text"
                                        placeholder="Password"
                                        className="bg-transparent outline-none w-full text-black placeholder-black/50"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-2 ml-2">
                                <input type="checkbox" />
                                <p className="text-[#767676] text-xs">
                                    Remember me
                                </p>
                            </div>
                            <Link
                                href="/home"
                                className="w-full text-center bg-[#6367FF] text-white py-3 rounded-xl font-bold cursor-pointer"
                            >
                                Login
                            </Link>
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
                <div className="flex-1/4 w-full h-full flex flex-col bg-[url('/login-image.png')] bg-cover bg-center rounded-2xl p-6 text-white items-end justify-between">
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
