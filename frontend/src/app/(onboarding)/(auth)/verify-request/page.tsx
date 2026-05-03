import { Suspense } from "react";
import VerifyRequest from "@/core/components/onboarding/VerifyRequest";

export default function VerifyRequestPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen bg-white" />}>
            <VerifyRequest />
        </Suspense>
    );
}

