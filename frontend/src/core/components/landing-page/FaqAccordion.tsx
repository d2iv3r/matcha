"use client";

import { useState } from "react";

const faqData = [
    {
        question: "What happens if I encounter an error?",
        answer: "If you encounter an error, please try again later. If the problem persists, please contact our support team.",
    },
    {
        question: "Is my data secure?",
        answer: "Yes, your data is secure. We use industry-standard security measures to protect your data.",
    },
    {
        question: 'How does the "Matching Opportunity" work?',
        answer: 'Our "Matching Opportunity" feature uses advanced algorithms to connect you with potential partners based on your interests, preferences, and compatibility.',
    },
    {
        question: "What if I don't see any matches right away?",
        answer: "If you don't see any matches right away, don't worry! It can take some time to build up your profile and for our algorithm to find suitable matches. Try completing your profile, adding more details, and checking back regularly.",
    },
];

export default function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[800px]">
            {faqData.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                    <div
                        key={index}
                        onClick={() => toggleFaq(index)}
                        className="w-full flex flex-col gap-3 sm:gap-4 items-start bg-[#E2DCFF] rounded-2xl sm:rounded-3xl p-4 sm:p-5 cursor-pointer transition-all duration-300"
                    >
                        <div className="flex flex-row justify-between w-full items-center gap-2">
                            <p className="text-base sm:text-lg font-bold">
                                {faq.question}
                            </p>
                            <span
                                className="text-xl font-bold text-[#6367FF] transition-transform duration-300 transform"
                                style={{
                                    transform: isOpen
                                        ? "rotate(45deg)"
                                        : "rotate(0deg)",
                                }}
                            >
                                +
                            </span>
                        </div>
                        {isOpen && (
                            <div className="animate-fade-in mt-2 sm:mt-0">
                                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
