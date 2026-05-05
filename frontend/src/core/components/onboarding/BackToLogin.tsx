import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { MoveLeft } from "lucide-react";

export default function BackToLogin() {
    return (
        <div className="w-full h-screen flex items-center justify-center p-3 bg-white">
            <div className="w-full h-full flex flex-row">
                <div className="w-full h-full flex items-center lg:items-start flex-col gap-10 p-6 flex-1">
                    <a href="/">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={140}
                            height={90}
                            priority
                            className="w-auto h-5 object-contain"
                        />
                    </a>
                    <div className="flex w-full max-w-[450px] flex-col gap-6 self-center text-sm">
                        <h1 className="pl-3 text-2xl font-bold">
                            Password changed successfully
                        </h1>
                        <h4 className="pl-3 font-medium">
                            You can now login with your new password.
                        </h4>
                        <div className="flex flex-col gap-6">
                            <a
                                href="/login"
                                className="w-full flex flex-row items-center border text-[#6367FF] justify-center gap-3 py-3 rounded-xl font-bold"
                            >
                                <MoveLeft />
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
