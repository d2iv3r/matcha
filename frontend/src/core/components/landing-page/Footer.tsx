"use client";

import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import men from "@/public/men.svg";
import women from "@/public/women.svg";
import shape4 from "@/public/shape4.svg";

interface FooterProps {
    handleScroll: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export default function Footer({ handleScroll }: FooterProps) {
    return (
        <section className=" px-6 relative w-full flex flex-col gap-8 items-center mt-45">
            <div className="relative w-full max-w-[1320px] flex flex-col gap-15 justify-center items-center">
                <Image
                    src={men}
                    alt="men"
                    width={280}
                    height={280}
                    className="absolute bottom-0 -left-10 md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px]"
                />
                <Image
                    src={women}
                    alt="women"
                    width={170}
                    height={170}
                    className="absolute bottom-0 -right-10 md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px]"
                />
                <Image
                    src={shape4}
                    alt="shape"
                    width={1608}
                    height={212}
                    className="absolute bottom-10 md:bottom-0 scale-x-260 scale-y-280 md:scale-x-100 md:scale-y-100"
                />
                <div className="relative md:px-12 flex justify-between w-full max-w-[1200px] items-end py-4 md:p-4">
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
                        <a
                            href="#hero"
                            onClick={(e) => handleScroll(e, "hero")}
                            className="smooth"
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            onClick={(e) => handleScroll(e, "about")}
                        >
                            About Us
                        </a>
                        <a
                            href="#discover-brides"
                            onClick={(e) =>
                                handleScroll(e, "discover-brides")
                            }
                        >
                            Discover Brides
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
