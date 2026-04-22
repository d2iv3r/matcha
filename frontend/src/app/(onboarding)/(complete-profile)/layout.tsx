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
        <div className="w-full min-h-screen flex flex-col gap-4 items-center justify-center p-3 bg-[url('/image-pending-profile.png')] bg-cover bg-center relative">
            <Image
                src={logo}
                alt="Logo"
                width={180}
                height={120}
                priority
                fetchPriority="high"
                className="py-5"
                style={{ width: "auto", height: "auto" }}
            />
            <div className="flex-1 w-full rounded-3xl max-w-[600px] bg-background mb-4 relative overflow-hidden flex flex-col [&>div]:flex-1">
                {children}
            </div>
        </div>
    );
}
