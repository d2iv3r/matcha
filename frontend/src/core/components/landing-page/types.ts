import { StaticImageData } from "next/image";
import girl1 from "@/public/girl1.png";
import girl2 from "@/public/girl2.png";
import girl3 from "@/public/girl3.png";
import girl4 from "@/public/girl4.png";
import girl5 from "@/public/girl5.png";
import girl6 from "@/public/girl6.png";
import girl7 from "@/public/girl7.png";
import girl8 from "@/public/girl8.png";

export interface ProfilePreview {
    img: StaticImageData;
    name: string;
    age: number;
    loc: string;
}

export const DISCOVER_PROFILES: ProfilePreview[] = [
    { img: girl1, name: "Sophie", age: 24, loc: "Paris, FR" },
    { img: girl2, name: "Emma", age: 22, loc: "London, UK" },
    { img: girl3, name: "Elena", age: 26, loc: "Madrid, ES" },
    { img: girl4, name: "Aria", age: 25, loc: "Berlin, DE" },
    { img: girl5, name: "Isabella", age: 23, loc: "Rome, IT" },
    { img: girl6, name: "Olivia", age: 27, loc: "New York, US" },
    { img: girl7, name: "Mila", age: 24, loc: "Amsterdam, NL" },
    { img: girl8, name: "Chloe", age: 21, loc: "Sydney, AU" },
];
