"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ClientRedirect({ requireComplete }: { requireComplete: boolean }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedValue = localStorage.getItem("is_profile_complete");
        const isComplete = storedValue === "true" || storedValue === "1" || storedValue === "true"; 

        if (requireComplete && !isComplete) {
            // If in platform but profile is incomplete -> go to onboarding
            router.push("/step1");
        } else if (!requireComplete && isComplete) {
            // If in onboarding but profile is complete -> go home
            // Exception: Allow Step 6 so they see the success message
            if (pathname !== "/step6") {
                router.push("/home");
            }
        }
    }, [requireComplete, router, pathname]);

    return null;
}
