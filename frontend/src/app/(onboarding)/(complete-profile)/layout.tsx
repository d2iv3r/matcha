"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: ReactNode }) {
    const router = useRouter();
    // const [isChecking, setIsChecking] = useState(true);

    // useEffect(() => {
    //     const token = localStorage.getItem("access_token");
    //     if (!token) {
    //         router.replace("/login");
    //     } else {
    //         setIsChecking(false);
    //     }
    // }, [router]);

    // if (isChecking) {
    //     return (null); // Or you could render a small loading spinner here
    // }

    return (
        <div className="w-full h-screen flex flex-col gap-4 items-center justify-center p-3 bg-[url('/image-pending-profile.png')] bg-cover bg-center relative -z-10s0">
            <Image
                src={logo}
                alt="Logo"
                width={180}
                height={120}
                priority
                fetchPriority="high"
                className="pb-10"
                style={{ width: "auto", height: "auto" }}
            />
            <div className="w-full h-full rounded-3xl max-h-[calc(100vh-180px)] max-w-[600px] flex justify-center items-center bg-background z-[-1s]">
                {children}
            </div>
        </div>
    );
}
