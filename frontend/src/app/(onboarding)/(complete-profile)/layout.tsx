import { ReactNode } from "react";
import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="w-full h-screen flex flex-col gap-4 items-center justify-center p-3 bg-[url('/image-pending-profile.png')] bg-cover bg-center relative -z-10s0">
            <Image
                src={logo}
                alt="Logo"
                width={180}
                height={180}
                className="w-45 pb-10"
            />
            <div className="w-full h-full rounded-3xl max-h-[calc(100vh-180px)] max-w-[600px] flex justify-center items-center bg-background z-[-1s]">
                {children}
            </div>
        </div>
    );
}
