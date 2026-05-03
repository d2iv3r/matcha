"use client";

import FaqAccordion from "@/core/components/landing-page/FaqAccordion";

export default function FAQ() {
    return (
        <section
            id="faq"
            className="w-full px-6 max-w-[1320px] flex flex-col gap-15 items-center scroll-mt-10"
        >
            <div className="w-full flex flex-col gap-15 items-center justify-center">
                <p className="text-4xl font-bold">FAQ</p>
                <FaqAccordion />
            </div>
            <p className="text-sm font-medium text-center max-w-[450px]">
                A soulmate is not someone who completes you. No, a soulmate is
                someone who influences you to complete yourself.
            </p>
            <a
                href="/sign-up"
                className="flex flex-row gap-4 bg-[#FFDBFD] px-12 py-3 rounded-xl shadow-lg"
            >
                <p className=" text-lg font-bold">Sign Up Now!</p>
            </a>
        </section>
    );
}
