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
import { Menu } from "lucide-react";

export default async function Marketing() {
    return (
        <section className="w-full flex flex-col gap-20 items-center justify-center overflow-x-hiddsen">
            <section
                id="hero"
                className="w-full flex flex-col items-center justify-center px-6"
            >
                <Image
                    src={shape1}
                    alt="Shape"
                    width={1100}
                    height={500}
                    className="absolute -top-20 left-1/2 -translate-x-1/2 -z-10 -rotate-100 md:rotate-0 scale-190 md:scale-100"
                />
                <div className="w-full max-w-[1320px] flex flex-col gap-4 justify-center">
                    <nav className="relative w-full flex flex-row gap-4 items-center justify-between mt-5">
                        <Image src={logo} alt="Logo" width={140} height={140} />
                        <div className="hidden lg:flex flex-1 flex-row gap-6 items-center justify-center text-white font-bold">
                            <a href="#hero" className="text-md">
                                Home
                            </a>
                            <a href="#about" className="text-md">
                                About
                            </a>
                            <a href="#discover-brides" className="text-md">
                                Discover Brides
                            </a>
                            <a href="#faq" className="text-md">
                                FAQ
                            </a>
                        </div>
                        <div className="hidden lg:flex flex-row gap-6 items-center justify-center font-bold text-[#2F2CD5]">
                            <a href="/login" className="text-md">
                                LOGIN
                            </a>
                            <a
                                href="/sign-up"
                                className="text-md underline underline-offset-2"
                            >
                                SIGN UP
                            </a>
                        </div>
                        <div className="lg:hidden">
                            <button className="text-white">
                                <Menu color="black" size={30} />
                            </button>
                        </div>
                    </nav>
                    <div className="w-full flex flex-col md:flex-row gap-4 md:justify-around md:-mt-20">
                        <div className=" flex xl:ml-35 flex-col gap-9 justify-center text-white">
                            <h1 className="text-3xl w-[280px] font-bold">
                                Maximize your opportunities to find your
                                Soulmate
                            </h1>
                            <p className="text-sm w-[410px]">
                                By filtering out the noise, our service focuses
                                on high-compatibility introductions, ensuring
                                every interaction brings you one step closer to
                                your soulmate
                            </p>
                            <div className="flex justify-center items-center bg-[#FFDBFD] w-fit rounded-2xl px-14 py-4 shadow-lg mt-7">
                                <p className="font-black text-xs text-black">
                                    Find your Soulmate !
                                </p>
                            </div>
                        </div>
                        <div className=" flex flex-row items-center justify-center -space-x-20">
                            <div className="z-3 bg-[#BF549F] p-3 flex flex-col gap-4 items-center justify-center rounded-[24px] rotate-[5deg] shadow-xl">
                                <div className="overflow-hidden rounded-[12px]">
                                    <Image
                                        src={girl1}
                                        alt="Girl"
                                        width={220}
                                        height={220}
                                        className="object-cover hover:scale-110 transition-transform duration-500 ease-in-out xl:w-[220px] lg:w-[180px] md:w-[140px] sm:w-[100px]"
                                    />
                                </div>
                                <p className="text-white text-lg mb-2">
                                    Find your love
                                </p>
                            </div>
                            <div className="z-2 bg-[#DDDDDD] p-3 flex flex-col gap-4 items-center justify-center rounded-[24px] rotate-[12deg] shadow-xl mt-40">
                                <div className="overflow-hidden rounded-[12px]">
                                    <Image
                                        src={girl1}
                                        alt="Girl"
                                        width={220}
                                        height={220}
                                        className="object-cover hover:scale-110 transition-transform duration-500 ease-in-out xl:w-[220px] lg:w-[180px] md:w-[140px] sm:w-[100px]"
                                    />
                                </div>
                                <p className="text-lg mb-2">Meet People</p>
                            </div>
                            <div className="z-1 bg-[#545454] p-3 flex flex-col gap-4 items-center justify-center rounded-[24px] rotate-[20deg] shadow-xl mt-90">
                                <div className="overflow-hidden rounded-[12px]">
                                    <Image
                                        src={girl1}
                                        alt="Girl"
                                        width={220}
                                        height={220}
                                        className="object-cover hover:scale-110 transition-transform duration-500 ease-in-out xl:w-[220px] lg:w-[180px] md:w-[140px] sm:w-[100px]"
                                    />
                                </div>
                                <p className="text-white text-lg mb-2">
                                    Made with Love
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-10">
                        <div className="flex flex-col gap-2 w-[200px]">
                            <div className="flex flex-row gap-4 items-center h-20">
                                <Image
                                    src={perfectMatch}
                                    alt="Logo"
                                    width={60}
                                    height={60}
                                />
                                <p className="text-xl font-bold">
                                    500+ Members
                                </p>
                            </div>
                            <p className="text-sm text-[#727272]">
                                Over five hundred of people are using matchvibe.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 w-[200px]">
                            <div className="flex flex-row gap-4 items-center h-20">
                                <Image
                                    src={smartAi}
                                    alt="Logo"
                                    width={60}
                                    height={60}
                                />
                                <p className="text-xl font-bold">Smart Ai</p>
                            </div>
                            <p className="text-sm text-[#727272]">
                                Best Match based on an intelligent algorithm.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 w-[200px]">
                            <div className="flex flex-row gap-4 items-center h-20">
                                <Image
                                    src={smile}
                                    alt="Logo"
                                    width={60}
                                    height={60}
                                />
                                <p className="text-xl font-bold">
                                    Perfect Match
                                </p>
                            </div>
                            <p className="text-sm text-[#727272]">
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
                    className="absolute top-30 left-0"
                />
                <Image
                    src={shape3}
                    alt="Shape"
                    width={175}
                    height={867}
                    className="absolute -top-30 right-0"
                />
                <div
                    id="discover-brides"
                    className="w-full max-w-[1320px] grid grid-cols-5 grid-rows-4 gap-8"
                >
                    <div className="col-span-1 row-span-2 flex flex-col gap-4 pt-5">
                        <p className="text-4xl font-bold">
                            Do not stay alone...
                        </p>
                        <p className="text-sm text-[#727272] w-[85%]">
                            Maybe one of these profiles is your future bride.
                            Just be more persistent
                        </p>
                    </div>
                    {Array.from({ length: 9 }).map((_, index) => (
                        <div
                            key={index}
                            className="col-span-1 row-span-2 aspect-3.5/4.5 relative rounded-xl flex flex-col justify-end px-3 py-2 shadow-lg overflow-hidden group cursor-pointer"
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
                <p className="text-2xl font-semibold text-[#6367FF] underline underline-offset-3 hover:text-[#0b10a2] transition-colors duration-300 cursor-pointer">
                    Check out more than 400 profiles
                </p>
            </section>
            <section
                id="faq"
                className="w-full px-6 max-w-[1320px] flex flex-col gap-15 justify-center items-center"
            >
                <div className="flex flex-col gap-15 items-center justify-center">
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
                        width={450}
                        height={450}
                        className="absolute bottom-0 -left-10"
                    />
                    <Image
                        src={women}
                        alt="women"
                        width={250}
                        height={250}
                        className="absolute bottom-0 right-0"
                    />
                    <Image
                        src={shape4}
                        alt="men"
                        width={1608}
                        height={212}
                        className="absolute bottom-0"
                    />
                    <div className="px-12 relative flex justify-between w-full max-w-[1200px] items-end p-4">
                        <p className="text-xs">
                            © 2026 Matcha. All rights reserved.
                        </p>
                        <Image src={logo} alt="men" width={150} height={150} />
                        <div className="flex flex-col gap-2 text-xs items-end pr-15 font-bold">
                            <p>Home</p>
                            <p>About Us</p>
                            <p>Discover Brides</p>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}
