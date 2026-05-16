"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function TOSPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col relative z-10 text-white selection:bg-[#FFB800] selection:text-black">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 md:px-8 pt-24 pb-12 sm:pt-32 md:pt-40 md:pb-24">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
            Welcome to Shard by Dynexus. By purchasing, accessing, or using our services, you agree to these Terms of Service.
            <br />
            Last Updated: May 16, 2026
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#content"
              className="px-6 py-2.5 bg-[#FFB800] hover:bg-[#E5A500] text-black text-sm font-bold rounded-xl shadow-sm shadow-[#FFB800]/20 transition-all active:scale-95"
            >
              Read Terms
            </a>
            <Link
              href="/"
              className="px-6 py-2.5 border border-white/10 hover:bg-white/5 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div id="content" className="space-y-8 scroll-mt-24">
          {/* Section 1 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">1. Definitions</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>
                <span className="text-white font-medium">Services</span> refers to all hosting services, Discord bot hosting, subscriptions, panel access, and support provided by Shard by Dynexus.
              </p>
              <p>
                <span className="text-white font-medium">Servers</span> refers to containers, storage, databases, and resources provided to users.
              </p>
              <p>
                <span className="text-white font-medium">User</span> refers to any person or entity using our services.
              </p>
              <p>
                <span className="text-white font-medium">Discord Bot</span> refers to any bot, automation, script, or software interacting with Discord.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">2. Eligibility</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>You must be at least 18 years old or have permission from a parent or legal guardian to use our services.</p>
              <p>By using our services, you confirm that you are legally allowed to enter this agreement.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">3. Service Usage</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>You are fully responsible for all activity on your account and servers, including uploaded files, bot code, databases, API usage, and third-party integrations.</p>
              <p>You must comply with all applicable laws and Discord Terms of Service and Developer Policies.</p>
              <p>Shard by Dynexus is not affiliated with Discord.</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">4. Rights We Reserve</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We reserve the right to suspend, terminate, restrict, or remove services at any time, with or without notice.</p>
              <p>We may investigate abuse, fraud, suspicious activity, and access uploaded files when necessary for security, legal compliance, and service integrity.</p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">5. Prohibited Activities</h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light mb-4">The following are strictly prohibited:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300 marker:text-[#FFB800] font-light">
              <li>Illegal activities</li>
              <li>Selfbots</li>
              <li>Token grabbers</li>
              <li>Phishing bots</li>
              <li>Spam or raid bots</li>
              <li>Scam bots</li>
              <li>Malware or exploit tools</li>
              <li>Cryptocurrency mining</li>
              <li>Proxy/VPN abuse</li>
              <li>Resource abuse (CPU, RAM, storage)</li>
              <li>Brute-force attacks</li>
              <li>DDoS attacks</li>
              <li>Port scanning or internet-wide scanning</li>
              <li>Any activity intended to harm others</li>
            </ul>
            <p className="text-sm text-gray-300 leading-relaxed font-light mt-4">Violation may result in immediate suspension or permanent termination without refund.</p>
          </div>

          {/* Section 6 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">6. Payments & Billing</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>All payments are final.</p>
              <p>We do not offer refunds under any circumstances, including cancellations, partial usage, service suspension, or termination due to Terms violations.</p>
              <p>Recurring services renew automatically unless cancelled before the next billing cycle.</p>
              <p>Users are responsible for managing their own subscriptions and cancellations.</p>
              <p>Unpaid invoices may result in immediate suspension.</p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">7. Chargebacks & Disputes</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We maintain a strict no-tolerance policy toward chargebacks and payment disputes.</p>
              <p>If a chargeback or dispute is filed:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#FFB800]">
                <li>Services may be suspended or terminated</li>
                <li>Your account may be permanently banned</li>
                <li>Outstanding balances may remain payable</li>
              </ul>
              <p>Users must contact us first before opening disputes.</p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">8. Data Loss & Backups</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>Users are solely responsible for maintaining backups of their files, databases, and configurations.</p>
              <p>Shard by Dynexus is not responsible for data loss caused by outages, hardware failure, suspension, deletion, or security incidents.</p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">9. Uptime & Availability</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We do not guarantee uninterrupted uptime or continuous service availability.</p>
              <p>Downtime may occur due to maintenance, provider outages, hardware failure, or third-party issues.</p>
              <p>We are not liable for downtime-related losses.</p>
            </div>
          </div>

          {/* Section 10 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">10. Limited Liability</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>Shard by Dynexus is not liable for data loss, lost profits, business interruption, or indirect damages.</p>
              <p>Our maximum liability shall never exceed the amount paid for the affected service during the last billing cycle.</p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">11. Account Deletion</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>Deleting your account or services may permanently remove all associated files and paid services.</p>
              <p>We do not guarantee recovery of deleted or suspended accounts.</p>
              <p>Accounts terminated for abuse or fraud may be deleted without notice.</p>
            </div>
          </div>

          {/* Section 12 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">12. Governing Law</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>These Terms are governed by the laws of India.</p>
              <p>Any disputes shall be subject to the jurisdiction of competent courts in India.</p>
            </div>
          </div>

          {/* Section 13 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">13. Changes to Terms</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We may update these Terms at any time.</p>
              <p>Continued use of our services means you accept the updated Terms.</p>
            </div>
          </div>

          {/* Section 14 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">14. Contact</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>For support, billing, abuse reports, or legal inquiries:</p>
              <p>
                <span className="text-white font-medium">Email:</span>{" "}
                <a href="mailto:contact@dynexus.space" className="text-[#FFB800] hover:underline">
                  contact@dynexus.space
                </a>
              </p>
             
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
