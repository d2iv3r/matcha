"use client";

import { useState } from "react";
import Navbar from "@/core/components/landing-page/Navbar";
import Hero from "@/core/components/landing-page/Hero";
import About from "@/core/components/landing-page/About";
import DiscoverBrides from "@/core/components/landing-page/DiscoverBrides";
import FAQ from "@/core/components/landing-page/FAQ";
import Footer from "@/core/components/landing-page/Footer";

export default function Marketing() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMenuOpen(false);
    };

    return (
        <section className="w-full flex flex-col gap-20 items-center relative">
            <Hero>
                <Navbar
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    handleScroll={handleScroll}
                />
            </Hero>
            <About />
            <DiscoverBrides />
            <FAQ />
            <Footer handleScroll={handleScroll} />
        </section>
    );
}
