import { Suspense } from "react";
import ResetPassword from "@/core/components/onboarding/ResetPassword";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen bg-white" />}>
            <ResetPassword />
        </Suspense>
    );
}
