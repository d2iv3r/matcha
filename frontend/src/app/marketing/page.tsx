"use client";

import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import shape1 from "@/public/shape1.svg";
import shape2 from "@/public/shape2.svg";
import shape3 from "@/public/shape3.svg";
import girl1 from "@/public/girl1.png";
import quots from "@/public/quots.svg";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import smartAi from "@/public/smartai.svg";
import perfectMatch from "@/public/love.svg";
import smile from "@/public/smile.svg";
import FaqAccordion from "@/components/FaqAccordion";
import men from "@/public/men.svg";
import women from "@/public/women.svg";
import shape4 from "@/public/shape4.svg";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Marketing() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <section className="w-full h-full flex flex-col gap-20 items-center justify-center overflow-x-hiddsen relative overflow-hidden">
            <section
                id="hero"
                className="w-full h-full flex flex-col items-center justify-center px-6 relative"
            >
                <Image
                    src={shape1}
                    alt="Shape"
                    width={1100}
                    height={500}
                    className="absolute -top-20 left-1/2 -translate-x-1/2 -z-10 -rotate-45 md:rotate-0 scale-190 md:scale-100"
                />
                <div className="w-full max-w-[1320px] flex flex-col gap-4 justify-center relative">
                    <nav className="relative w-full flex flex-row gap-4 items-center justify-between mt-5 z-50">
                        <Image src={logo} alt="Logo" width={140} height={140} />

                        {/* Desktop Links */}
                        <div className="hidden lg:flex flex-1 flex-row gap-6 items-center justify-center text-white font-bold">
                            <a
                                href="#hero"
                                className="text-md hover:text-[#FFDBFD] transition-colors"
                            >
                                Home
                            </a>
                            <a
                                href="#about"
                                className="text-md hover:text-[#FFDBFD] transition-colors"
                            >
                                About
                            </a>
                            <a
                                href="#discover-brides"
                                className="text-md hover:text-[#FFDBFD] transition-colors"
                            >
                                Discover Brides
                            </a>
                            <a
                                href="#faq"
                                className="text-md hover:text-[#FFDBFD] transition-colors"
                            >
                                FAQ
                            </a>
                        </div>
                        <div className="hidden lg:flex flex-row gap-6 items-center justify-center font-bold text-[#2F2CD5]">
                            <a
                                href="/login"
                                className="text-md hover:text-white transition-colors"
                            >
                                LOGIN
                            </a>
                            <a
                                href="/sign-up"
                                className="text-md underline underline-offset-2 hover:text-white transition-colors"
                            >
                                SIGN UP
                            </a>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="lg:hidden z-50">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-black bg-white/20 p-2 rounded-xl backdrop-blur-md transition-all active:scale-95"
                            >
                                {isMenuOpen ? (
                                    <X size={30} />
                                ) : (
                                    <Menu size={30} />
                                )}
                            </button>
                        </div>

                        {/* Smooth Mobile Dropdown */}
                        <div
                            className={`absolute top-[120%] right-0 w-full md:w-[350px] bg-white rounded-3xl shadow-2xl flex flex-col p-6 gap-6 
                                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-right
                                ${isMenuOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-4 invisible"}`}
                        >
                            <div className="flex flex-col gap-5 text-black font-bold text-lg">
                                <a
                                    href="#hero"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="hover:text-[#6367FF] transition-colors border-b border-gray-100 pb-3"
                                >
                                    Home
                                </a>
                                <a
                                    href="#about"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="hover:text-[#6367FF] transition-colors border-b border-gray-100 pb-3"
                                >
                                    About
                                </a>
                                <a
                                    href="#discover-brides"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="hover:text-[#6367FF] transition-colors border-b border-gray-100 pb-3"
                                >
                                    Discover Brides
                                </a>
                                <a
                                    href="#faq"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="hover:text-[#6367FF] transition-colors pb-1"
                                >
                                    FAQ
                                </a>
                            </div>
                            <div className="flex flex-col gap-3 mt-2">
                                <a
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full py-4 text-center rounded-xl bg-[#E2DCFF] text-black font-bold hover:bg-[#c9c0fb] transition-colors"
                                >
                                    Login
                                </a>
                                <a
                                    href="/sign-up"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full py-4 text-center rounded-xl bg-[#6367FF] text-white font-bold hover:bg-[#6367FF]/90 transition-colors"
                                >
                                    Sign Up
                                </a>
                            </div>
                        </div>
                    </nav>
                    {/* Hero Content: Text + Cards */}
                    <div className="w-full flex flex-col md:flex-row md:justify-around md:items-center md:-mt-10 px-4">
                        {/* Left: Text content */}
                        <div className="flex flex-col gap-5 md:gap-9 justify-center text-white xl:ml-25 z-10">
                            <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl max-w-[90%] md:max-w-[280px] lg:max-w-[400px] font-bold leading-tight">
                                Maximize your opportunities to find your
                                Soulmate
                            </h1>
                            <p className="text-xs sm:text-sm max-w-[90%] md:max-w-[310px] lg:max-w-[410px] text-white/90">
                                By filtering out the noise, our service focuses
                                on high-compatibility introductions, ensuring
                                every interaction brings you one step closer to
                                your soulmate
                            </p>
                            <button
                                onClick={() => router.push("/sign-up")}
                                className="flex justify-center items-center bg-[#FFDBFD] w-fit rounded-2xl px-10 sm:px-14 py-3 sm:py-4 shadow-lg hover:bg-[#f5c5f3] transition-colors duration-300 cursor-pointer"
                            >
                                <p className="font-black text-xs sm:text-sm text-black">
                                    Find your Soulmate !
                                </p>
                            </button>
                        </div>

                        {/* Right: 3 rotating photo cards */}
                        <div className="flex flex-row items-center justify-center -space-x-14 sm:-space-x-14 md:-space-x-16 lg:-space-x-20">
                            <div className="z-3 bg-[#BF549F] p-2 sm:p-3 flex flex-col gap-2 sm:gap-4 items-center justify-center rounded-[16px] sm:rounded-[24px] rotate-[5deg] shadow-xl">
                                <div className="overflow-hidden rounded-[8px] sm:rounded-[12px]">
                                    <Image
                                        src={girl1}
                                        alt="Girl"
                                        width={220}
                                        height={220}
                                        className="object-cover hover:scale-110 transition-transform duration-500 ease-in-out 
                                        w-[140px] lg:w-[180px] xl:w-[220px]"
                                    />
                                </div>
                                <p className="text-white text-xs sm:text-sm md:text-lg mb-1 sm:mb-2">
                                    Find your love
                                </p>
                            </div>
                            <div className="z-2 bg-[#DDDDDD] p-2 sm:p-3 flex flex-col gap-2 sm:gap-4 items-center justify-center rounded-[16px] sm:rounded-[24px] rotate-12 shadow-xl mt-22 sm:mt-28 md:mt-32 lg:mt-40">
                                <div className="overflow-hidden rounded-[8px] sm:rounded-[12px]">
                                    <Image
                                        src={girl1}
                                        alt="Girl"
                                        width={220}
                                        height={220}
                                        className="object-cover hover:scale-110 transition-transform duration-500 ease-in-out 
                                        w-[140px] lg:w-[180px] xl:w-[220px]"
                                    />
                                </div>
                                <p className="text-xs sm:text-sm md:text-lg mb-1 sm:mb-2">
                                    Meet People
                                </p>
                            </div>
                            <div className="z-1 bg-[#545454] p-2 sm:p-3 flex flex-col gap-2 sm:gap-4 items-center justify-center rounded-[16px] sm:rounded-[24px] rotate-20 shadow-xl mt-50 sm:mt-56 md:mt-64 lg:mt-80 xl:mt-90">
                                <div className="overflow-hidden rounded-[8px] sm:rounded-[12px]">
                                    <Image
                                        src={girl1}
                                        alt="Girl"
                                        width={220}
                                        height={220}
                                        className="object-cover hover:scale-110 transition-transform duration-500 ease-in-out 
                                        w-[140px] lg:w-[180px] xl:w-[220px]"
                                    />
                                </div>
                                <p className="text-white text-xs sm:text-sm md:text-lg mb-1 sm:mb-2">
                                    Made with Love
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-center md:items-start flex-wrap">
                        <div className="flex flex-col items-center md:items-start gap-2 max-w-[200px]">
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <Image
                                    src={perfectMatch}
                                    alt="Logo"
                                    width={45}
                                    height={45}
                                    className="sm:w-[60px] sm:h-[60px]"
                                />
                                <p className="text-lg sm:text-xl font-bold">
                                    500+ Members
                                </p>
                            </div>
                            <p className="text-xs sm:text-sm text-[#727272] text-center">
                                Over five hundred of people are using matchvibe.
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-start gap-2 max-w-[200px]">
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <Image
                                    src={smartAi}
                                    alt="Logo"
                                    width={45}
                                    height={45}
                                    className="sm:w-[60px] sm:h-[60px]"
                                />
                                <p className="text-lg sm:text-xl font-bold">
                                    Smart Ai
                                </p>
                            </div>
                            <p className="text-xs sm:text-sm text-[#727272] text-center">
                                Best Match based on an intelligent algorithm.
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-start gap-2 max-w-[200px]">
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <Image
                                    src={smile}
                                    alt="Logo"
                                    width={45}
                                    height={45}
                                    className="sm:w-[60px] sm:h-[60px]"
                                />
                                <p className="text-lg sm:text-xl font-bold">
                                    Perfect Match
                                </p>
                            </div>
                            <p className="text-xs sm:text-sm text-[#727272] text-center">
                                500+ of people are happy using our platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section
                id="about"
                className="w-full max-w-[1320px] flex flex-col gap-4 justify-center items-center px-6"
            >
                <div className="flex flex-col gap-3 items-center justify-center">
                    <Image src={quots} alt="Logo" width={80} height={80} />
                    <p className="text-lg font-bold">
                        WHAT CLIENTS SAY ABOUT US
                    </p>
                </div>
                <TestimonialsCarousel />
            </section>
            <section className="relative px-6 w-full flex flex-col gap-8 justify-center items-center">
                <Image
                    src={shape2}
                    alt="Shape"
                    width={175}
                    height={867}
                    className="absolute top-30 left-0 -z-10 hidden md:block"
                />
                <Image
                    src={shape3}
                    alt="Shape"
                    width={175}
                    height={867}
                    className="absolute -top-30 right-0 -z-10 hidden md:block"
                />
                {/* Desktop: text + cards in 5-col 2-row grid */}
                <div
                    id="discover-brides"
                    className="hidden md:grid w-full max-w-[1320px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-rows-2 gap-8"
                >
                    <div className="col-span-1 row-span-2 flex flex-col gap-4 pt-5">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
                            Do not stay alone...
                        </p>
                        <p className="text-xs lg:text-sm text-[#727272] w-[85%]">
                            Maybe one of these profiles is your future bride.
                            Just be more persistent
                        </p>
                    </div>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className={`col-span-1 row-span-1 aspect-3.5/4.5 relative rounded-xl flex flex-col justify-end px-3 py-2 shadow-lg overflow-hidden group cursor-pointer ${index >= 6 ? "hidden xl:block" : index >= 4 ? "hidden lg:block" : ""}`}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                                style={{ backgroundImage: `url(${girl1.src})` }}
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-0" />
                            <Image
                                src={girl1}
                                alt={`Profile ${index + 1}`}
                                width={50}
                                height={50}
                                className="absolute top-3 left-3 rounded-full border-2 border-white object-cover w-13 h-13 z-10"
                            />
                            <div className="flex flex-col z-10">
                                <p className="text-white font-bold relative text-lg">
                                    Emily, 20
                                </p>
                                <p className="text-white font-medium relative text-lg">
                                    Los Angles, USA
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile: centered text on top + infinite scrolling cards */}
                <div className="flex flex-col items-center gap-6 md:hidden w-full">
                    <div className="text-center px-4">
                        <p className="text-2xl sm:text-3xl font-bold">
                            Do not stay alone...
                        </p>
                        <p className="text-xs sm:text-sm text-[#727272] mt-2">
                            Maybe one of these profiles is your future bride.
                            Just be more persistent
                        </p>
                    </div>
                    <div className="w-full overflow-hidden marquee-wrapper">
                        <div className="flex w-max animate-infinite-scroll">
                            {/* Duplicate cards for seamless loop */}
                            {[
                                ...Array.from({ length: 6 }),
                                ...Array.from({ length: 6 }),
                            ].map((_, index) => (
                                <div
                                    key={index}
                                    className="shrink-0 w-[150px] aspect-3/4 relative rounded-xl flex flex-col justify-end px-2 py-2 shadow-lg overflow-hidden group cursor-pointer mx-2"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                                        style={{
                                            backgroundImage: `url(${girl1.src})`,
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-0" />
                                    <Image
                                        src={girl1}
                                        alt={`Profile ${(index % 6) + 1}`}
                                        width={40}
                                        height={40}
                                        className="absolute top-2 left-2 rounded-full border-2 border-white object-cover w-10 h-10 z-10"
                                    />
                                    <div className="flex flex-col z-10">
                                        <p className="text-white font-bold relative text-sm">
                                            Emily, 20
                                        </p>
                                        <p className="text-white font-medium relative text-xs">
                                            Los Angles, USA
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/sign-up")}
                    className="text-2xl font-semibold text-[#6367FF] underline underline-offset-3 hover:text-[#0b10a2] transition-colors duration-300 cursor-pointer"
                >
                    Check out more than 400 profiles
                </button>
            </section>
            <section
                id="faq"
                className="w-full px-6 max-w-[1320px] flex flex-col gap-15 justify-center items-center"
            >
                <div className="w-full flex flex-col gap-15 items-center justify-center">
                    <p className="text-4xl font-bold">FAQ</p>
                    <FaqAccordion />
                </div>
                <p className="text-sm font-medium text-center max-w-[450px]">
                    A soulmate is not someone who completes you. No, a soulmate
                    is someone who influences you to complete yourself.
                </p>
                <div className="flex flex-row gap-4 bg-[#FFDBFD] px-12 py-3 rounded-xl shadow-lg">
                    <p className=" text-lg font-bold">Sign Up Now!</p>
                </div>
            </section>
            <section className=" px-6 relative w-full flex flex-col gap-8 justify-center items-center mt-45">
                <div className="relative w-full max-w-[1320px] flex flex-col gap-15 justify-center items-center">
                    <Image
                        src={men}
                        alt="men"
                        // width={450}
                        // height={450}
                        width={250}
                        height={250}
                        className="absolute bottom-0 -left-10 md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px]"
                    />
                    <Image
                        src={women}
                        alt="women"
                        // width={250}
                        // height={250}
                        width={150}
                        height={150}
                        className="absolute bottom-0 -right-10 md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px]"
                    />
                    <Image
                        src={shape4}
                        alt="men"
                        width={1608}
                        height={212}
                        className="absolute bottom-0 scale-x-260 scale-y-380 md:scale-x-100 md:scale-y-100"
                    />
                    <div className=" md:px-12 relative flex justify-between w-full max-w-[1200px] items-end py-4 md:p-4">
                        <p className="text-[10px] sm:text-xs text-nowrap hidden md:block">
                            © 2026 Matcha. All rights reserved.
                        </p>
                        <div className="">
                            <Image
                                src={logo}
                                alt="logo Matchvibe"
                                width={150}
                                height={150}
                            />
                        </div>
                        <div className="flex flex-col gap-2 text-xs items-end md:pr-15 font-bold ">
                            <a href="#">Home</a>
                            <a href="#">About Us</a>
                            <a href="#">Discover Brides</a>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}
