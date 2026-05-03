"use client";

import Image from "next/image";
import quots from "@/public/quots.svg";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

export default function About() {
    return (
        <section
            id="about"
            className="w-full max-w-[1320px] flex flex-col gap-4 items-center px-6 scroll-mt-10"
        >
            <div className="flex flex-col gap-3 items-center justify-center">
                <Image src={quots} alt="Logo" width={80} height={80} />
                <p className="text-lg font-bold">
                    WHAT CLIENTS SAY ABOUT US
                </p>
            </div>
            <TestimonialsCarousel />
        </section>
    );
}
