"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import shape2 from "@/public/shape2.svg";
import shape3 from "@/public/shape3.svg";
import { DISCOVER_PROFILES } from "./types";

export default function DiscoverBrides() {
    const router = useRouter();

    return (
        <section className="relative px-6 w-full flex flex-col gap-8 items-center">
            <Image
                src={shape2}
                alt="Shape"
                width={175}
                height={867}
                fetchPriority="high"
                priority
                className="absolute top-30 left-0 -z-10 hidden md:block w-auto h-auto"
            />
            <Image
                src={shape3}
                alt="Shape"
                width={175}
                height={867}
                fetchPriority="high"
                priority
                className="absolute -top-30 right-0 -z-10 hidden md:block w-auto h-auto"
            />
            {/* Desktop: text + cards in 5-col 2-row grid */}
            <div
                id="discover-brides"
                className="hidden md:grid w-full max-w-[1320px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-rows-2 gap-8 scroll-mt-10"
            >
                <div className="col-span-1 row-span-2 flex flex-col gap-4 pt-5">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
                        Do not stay alone...
                    </p>
                    <p className="text-xs lg:text-sm text-[#727272] w-[85%]">
                        Maybe one of these profiles is your future bride. Just
                        be more persistent
                    </p>
                </div>
                {DISCOVER_PROFILES.map((item, index: number) => (
                    <div
                        key={`${item.name}-${index}`}
                        className={`col-span-1 row-span-1 aspect-3.5/4.5 relative rounded-xl flex flex-col justify-end px-3 py-2 shadow-lg overflow-hidden group cursor-pointer ${index >= 6 ? "hidden xl:flex" : index >= 4 ? "hidden lg:flex" : ""}`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                            style={{
                                backgroundImage: `url(${item.img.src})`,
                            }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-80" />
                        <div className="relative z-10 flex flex-col">
                            <p className="text-white font-bold text-sm">
                                {item.name}, {item.age}
                            </p>
                            <p className="text-white/80 text-[10px]">
                                {item.loc}
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
                        Maybe one of these profiles is your future bride. Just
                        be more persistent
                    </p>
                </div>
                <div className="w-full overflow-hidden marquee-wrapper">
                    <div className="flex w-max animate-infinite-scroll">
                        {/* Duplicate cards for seamless loop */}
                        {[
                            ...DISCOVER_PROFILES.slice(0, 6),
                            ...DISCOVER_PROFILES.slice(0, 6),
                        ].map((item, index: number) => (
                            <div
                                key={`${item.name}-mobile-${index}`}
                                className="shrink-0 w-[150px] aspect-3/4 relative rounded-xl flex flex-col justify-end px-2 py-2 shadow-lg overflow-hidden group cursor-pointer mx-2"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                                    style={{
                                        backgroundImage: `url(${item.img.src})`,
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                                <div className="relative z-10 flex flex-col">
                                    <p className="text-white font-bold text-xs">
                                        {item.name}, {item.age}
                                    </p>
                                    <p className="text-white/80 text-[8px]">
                                        {item.loc}
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
    );
}
