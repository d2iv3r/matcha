

import { ReactNode } from "react";
import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: ReactNode }) {

        const cookieStore = await cookies();
        const hasAccess = cookieStore.has("access_token_cookie");
        const hasRefresh = cookieStore.has("refresh_token_cookie");
    
        if (!hasAccess && !hasRefresh) {
            redirect("/login");
        }

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
