import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import bg from "@/public/login-image.png";
import { Mail, MoveLeft } from "lucide-react";

export default function ForgotPassword() {
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
                            Recovery your Password
                        </h1>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h3 className="pl-4 text-black">Email</h3>
                                <div className="flex flex-row items-center gap-4 p-3 bg-[#EDEDED] rounded-xl">
                                    <Mail />
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className="bg-transparent outline-none w-full text-black placeholder-black/50"
                                    />
                                </div>
                            </div>
                            <a
                                href="/verify-request"
                                className="w-full flex items-center justify-center bg-[#6367FF] text-white py-3 rounded-xl font-bold"
                            >
                                Next
                            </a>
                            <a
                                href="/login"
                                className="w-full flex flex-row items-center justify-center gap-3 border py-2 rounded-xl font-bold"
                            >
                                <MoveLeft />
                                Back to Login
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
