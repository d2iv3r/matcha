"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import girl1 from "@/public/girl1.png";

const testimonials = [
    {
        quote: "This platform gave me the confidence to put myself back out there. It really does maximize your chances of meeting someone special.",
        name: "John Doe",
        location: "New York",
        image: girl1,
    },
    {
        quote: "I never thought I'd find my soulmate online, but MatchVibe made it so easy and authentic. The process feels deeply personal.",
        name: "Jane Smith",
        location: "London",
        image: girl1,
    },
    {
        quote: "The smart AI matching actually works. It filtered out the noise and introduced me to someone I instantly connected with.",
        name: "Michael Chen",
        location: "San Francisco",
        image: girl1,
    },
];

export default function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // const nextTestimonial = () => {
    //     setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    // };

    // const prevTestimonial = () => {
    //     setCurrentIndex(
    //         (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    //     );
    // };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col gap-8 items-center justify-center p-10 mt-6">
            <div className="flex flex-row gap-8 items-center justify-center w-full max-w-[1000px]">
                {/* Quote Content */}
                <div 
                    key={currentIndex}
                    className="flex flex-col gap-10 items-center justify-center w-[800px] min-h-[250px] animate-slide-left"
                >
                    <p className="text-3xl font-medium text-center leading-relaxed">
                        "{testimonials[currentIndex].quote}"
                    </p>
                    <div className="flex flex-row gap-4 items-center justify-center">
                        <Image
                            src={testimonials[currentIndex].image}
                            alt={testimonials[currentIndex].name}
                            width={50}
                            height={50}
                            className="rounded-full object-cover w-12 h-12"
                        />
                        <div className="flex flex-row text-lg">
                            <p className="font-bold">
                                {testimonials[currentIndex].name}
                            </p>
                            <p>, {testimonials[currentIndex].location}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex flex-row gap-3 mt-4">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                            index === currentIndex
                                ? "bg-[#6B6FFF] w-6"
                                : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
