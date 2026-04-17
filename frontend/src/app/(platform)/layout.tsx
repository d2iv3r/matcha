import Navbar from "@/core/components/Navbar";
import Footer from "@/core/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full md:h-screen flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden bg-[linear-gradient(328deg,rgba(200,206,229,1)_0%,rgba(225,230,247,1)_19%,rgba(237,241,253,1)_39%,rgba(234,237,252,1)_59%,rgba(225,229,246,1)_78%,rgba(200,206,229,1)_100%)]">
            <div className="w-full max-w-[1450px] min-h-[400px] h-full flex flex-col md:flex-row md:px-6 overflow-y-auto scrollbar-hide">
                <div className="px-5 py-5">
                    <Navbar />
                </div>
                {children}
            </div>
            <div className="w-full hidden md:block">
                <Footer />
            </div>
        </div>
    );
}
