import PricingSection from "@/components/PricingSection";
import Link from "next/link";

const IS_LAUNCHED = true; // Set to true to launch the Pricing Store!

export default function PricingsPage() {
  if (!IS_LAUNCHED) {
    return (
      <div className="relative md:h-full pb-8 md:pb-0 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,184,0,0.15)]">
            <svg className="w-10 h-10 text-[#FFB800]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349M3.75 21H6m0 0h2.25m0-11.177v-.958c0-.568.422-1.048.987-1.106a48.554 48.554 0 019.526 0 1.077 1.077 0 01.987 1.106v.958" />
            </svg>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight mb-3">
            Store <span className="text-[#FFB800]">Coming Soon!</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
            We are set to launch more features! Stay tuned — until then, get your free bots hosted.
          </p>
          <Link
            href="/panel/create"
            className="px-8 py-3 bg-[#FFB800] hover:bg-[#E5A500] text-black text-sm font-black rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(255,184,0,0.3)] hover:shadow-[0_0_30px_rgba(255,184,0,0.5)] active:scale-95"
          >
            Create Free Server →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative md:h-full pb-8 md:pb-0">
      <div className="animate-in fade-in zoom-in duration-500">
        <PricingSection />
      </div>
    </div>
  );
}
