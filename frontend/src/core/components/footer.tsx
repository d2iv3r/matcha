import Image from "next/image";
import logo from "@/public/logomatchvibe.svg";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="w-full h-15 flex items-center justify-between bg-[#F5F3FF] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)] p-4 px-15 text-xs text-black/50 relative z-999">
            <div className="flex flex-row items-center justify-between gap-6">
                <Link href="/confidentiality" className="text-[10px]">Confidentiality</Link>
                <Link href="/terms-of-use" className="text-[10px]">Terms of use</Link>
            </div>
            <Image src={logo} alt="Logo" width={140} height={140} />
            <p className="text-[10px]">© 2026 MatchVibe. All rights reserved.</p>
        </div>
    );
}
