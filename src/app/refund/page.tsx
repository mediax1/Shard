"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col relative z-10 text-white selection:bg-[#FFB800] selection:text-black">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 md:py-20 lg:py-24">
        {/* Hero Section */}
        <div className="mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Refund Policy
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
            Your satisfaction is our priority. Please review our refund and cancellation policies.
            <br />
            Last Updated: 13/05/2026
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-[#FFB800] hover:bg-[#E5A500] text-black text-sm font-bold rounded-xl shadow-sm shadow-[#FFB800]/20 transition-all active:scale-95"
            >
              Contact Support
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 border border-white/10 hover:bg-white/5 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-6 md:space-y-8 scroll-mt-16 md:scroll-mt-24">
          
          {/* Section 1 */}
          <div className="border border-white/10 bg-white/[0.02] p-5 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#FFB800]">
              1. General Refund Policy
            </h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>
                At dynexus bot.space, we strive to provide the best hosting experience for your bots and applications. 
                If you are unsatisfied with your purchase, we offer a <span className="text-white font-medium">3-day money-back guarantee</span> for new subscriptions.
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#FFB800]">
                <li>Refund requests must be submitted within 3 days (72 hours) of the original purchase.</li>
                <li>Refunds are not available for service renewals or upgrades.</li>
                <li>Certain promotional offers or discounted plans may be non-refundable; this will be explicitly stated during checkout.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border border-white/10 bg-white/[0.02] p-5 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#FFB800]">
              2. Eligibility criteria
            </h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>To be eligible for a refund, your account must meet the following criteria:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#FFB800]">
                <li>You must not have violated our Terms of Service (e.g., no abuse of our infrastructure, no malicious activity).</li>
                <li>Your request must be your first refund request with us. We do not provide refunds to users who have previously requested and received a refund.</li>
                <li>You must have a valid reason for the refund (e.g., service not functioning as advertised).</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border border-white/10 bg-white/[0.02] p-5 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#FFB800]">
              3. Processing Time
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Once your refund request is received and reviewed, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed and credited back to your original method of payment within <span className="text-white font-medium">5-10 business days</span>, depending on your bank or payment provider.
            </p>
          </div>

          {/* Section 4 */}
          <div className="border border-white/10 bg-white/[0.02] p-5 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#FFB800]">
              4. Cancellations
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light mb-6">
              You may cancel your subscription at any time through your billing dashboard. Canceling your subscription will prevent future billing. Upon cancellation, the servers on which your services are hosted will remain active for the <span className="text-white font-medium">next 3 days</span>, after which they will be permanently terminated. <span className="text-white font-medium">No prorated refunds</span> are provided for canceled subscriptions.
            </p>
          </div>

          {/* Section 5 */}
          <div className="border border-white/10 bg-white/[0.02] p-5 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-[#FFB800]">
              5. How to Request a Refund
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              To request a refund, please open a support ticket on our <a href="https://discord.gg/FHzr8Tss4Y" target="_blank" rel="noopener noreferrer" className="text-[#FFB800] hover:underline">Discord server</a> or reach out to us via the <Link href="/contact" className="text-[#FFB800] hover:underline">Contact Us</Link> page. Please include your invoice number and the reason for your request to expedite the process.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
