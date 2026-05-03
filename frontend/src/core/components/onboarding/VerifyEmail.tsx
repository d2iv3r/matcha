import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { MoveLeft } from "lucide-react";

interface VerifyEmailProps {
    email: string;
}

export default function VerifyEmail({ email }: VerifyEmailProps) {
    const the_email = email.length > 5 
        ? email.slice(0, 2) + "*****" + email.slice(email.indexOf("@"))
        : email;

    return (
        <div className="w-full h-screen flex items-center justify-center p-3 bg-transparent">
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
                    <div className="flex w-full max-w-[450px] flex-col gap-6 self-center text-sm">
                        <h1 className="pl-3 text-2xl font-bold">
                            Verify your email address
                        </h1>
                        <h4 className="pl-3 font-medium">
                            We sent an email to{" "}
                            <span className="font-bold">{the_email}</span>{" "}
                            please check your inbox and spam folder.
                        </h4>
                        <div className="flex flex-col gap-6">
                            <a
                                href="/sign-up"
                                className="w-full flex flex-row items-center justify-center gap-3 border py-2 rounded-xl font-bold"
                            >
                                <MoveLeft />
                                Back to Sign up
                            </a>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:flex flex-1/4 w-full h-full  flex-col bg-[url('/signup-image.png')] bg-cover bg-center rounded-2xl p-6 text-white items-end justify-between">
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
