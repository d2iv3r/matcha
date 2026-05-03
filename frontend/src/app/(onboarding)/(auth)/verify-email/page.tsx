import VerifyEmail from "@/core/components/onboarding/VerifyEmail";

export default async function VerifyEmailPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string | string[] }>;
}) {
    // Await searchParams in Next.js 15+ patterns, safely fallback otherwise
    const params = await searchParams;
    const rawEmail = params?.email;
    const email =
        (Array.isArray(rawEmail) ? rawEmail[0] : rawEmail) ||
        "example@example.com";

    return <VerifyEmail email={email} />;
}
