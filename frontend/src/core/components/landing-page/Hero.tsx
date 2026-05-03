"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import shape1 from "@/public/shape1.svg";
import girl1 from "@/public/girl1.png";
import girl2 from "@/public/girl2.png";
import man1 from "@/public/man1.png";
import smartAi from "@/public/smartai.svg";
import perfectMatch from "@/public/love.svg";
import smile from "@/public/smile.svg";

interface HeroProps {
    children?: React.ReactNode; // For Navbar
}

export default function Hero({ children }: HeroProps) {
    const router = useRouter();

    return (
        <section
            id="hero"
            className="w-full min-h-screen flex flex-col items-center px-6 relative"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <Image
                    src={shape1}
                    alt="Shape"
                    width={1100}
                    height={500}
                    className="absolute -top-20 left-1/2 -translate-x-1/2 -rotate-45 md:rotate-0 scale-190 md:scale-100"
                />
            </div>
            <div className="w-full max-w-[1320px] flex flex-col gap-4 relative">
                {children}

                {/* Hero Content: Text + Cards */}
                <div className="w-full flex flex-col md:flex-row md:justify-around md:items-center md:-mt-10 px-4">
                    {/* Left: Text content */}
                    <div className="flex flex-col gap-5 md:gap-9 justify-center text-white xl:ml-25 z-10">
                        <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl max-w-[90%] md:max-w-[280px] lg:max-w-[400px] font-bold leading-tight">
                            Maximize your opportunities to find your Soulmate
                        </h1>
                        <p className="text-xs sm:text-sm max-w-[90%] md:max-w-[310px] lg:max-w-[410px] text-white/90">
                            By filtering out the noise, our service focuses on
                            high-compatibility introductions, ensuring every
                            interaction brings you one step closer to your
                            soulmate
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
                                    alt="picture of a girl"
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
                                    src={man1}
                                    alt="picture of a man"
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
                                    src={girl2}
                                    alt="picture of a random Girl"
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
    );
}
