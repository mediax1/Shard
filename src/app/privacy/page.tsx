"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col relative z-10 text-white selection:bg-[#FFB800] selection:text-black">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 md:px-8 py-12 md:py-24">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
            This Privacy Policy explains how we collect, use, protect, and manage your information when you use Shard by Dynexus.
            <br />
            Last Updated: May 16, 2026
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#content"
              className="px-6 py-2.5 bg-[#FFB800] hover:bg-[#E5A500] text-black text-sm font-bold rounded-xl shadow-sm shadow-[#FFB800]/20 transition-all active:scale-95"
            >
              Read Policy
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
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">1. Information We Collect</h2>
            <div className="space-y-6 text-sm text-gray-300 leading-relaxed font-light">
              <div>
                <h3 className="text-white font-medium mb-2">Account Information</h3>
                <p>Including your email address, username, Discord ID, and billing-related information.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Server Data</h3>
                <p>Including uploaded files, bot code, databases, configurations, logs, and stored application data.</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Usage Data</h3>
                <p>Including IP addresses, login sessions, browser/device information, panel activity, and standard server logs.</p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">2. How We Use Your Information</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#FFB800]">
                <li>Provide and maintain our services</li>
                <li>Process billing and subscriptions</li>
                <li>Provide customer support</li>
                <li>Prevent abuse, fraud, and malicious activity</li>
                <li>Monitor infrastructure security</li>
                <li>Investigate Terms of Service violations</li>
                <li>Improve platform performance and reliability</li>
              </ul>
              <p className="mt-4">
                We may access uploaded files and server content when necessary for abuse prevention, legal compliance, fraud investigations, and maintaining service integrity.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">3. Discord Compliance</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>Users are solely responsible for ensuring their hosted bots comply with Discord Terms of Service, Developer Policies, and Community Guidelines.</p>
              <p>Shard by Dynexus is not affiliated with Discord.</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">4. Data Sharing</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We do not sell, trade, or rent your personal information.</p>
              <p>We may share limited necessary information with:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#FFB800]">
                <li>Payment processors</li>
                <li>Fraud prevention services</li>
                <li>Security providers</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p className="mt-4">
                We may disclose information where required by legal process, court order, abuse investigation, or governmental request.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">5. Cookies & Sessions</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We may use cookies, authentication sessions, and similar technologies to:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#FFB800]">
                <li>Maintain secure login sessions</li>
                <li>Improve security</li>
                <li>Improve user experience</li>
                <li>Prevent unauthorized access</li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">6. Data Retention</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We retain personal and service-related information only as long as necessary for operations, billing, abuse prevention, and legal compliance.</p>
              <p>If you delete your account or services, active server data may be removed permanently.</p>
              <p>Some records such as payment history, abuse investigation logs, backups, and legally required records may be retained longer where necessary.</p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">7. Data Security</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We use reasonable industry-standard security measures to protect your information and server files.</p>
              <p>However, no internet transmission or storage system is completely secure, and we cannot guarantee absolute security.</p>
              <p>Users are responsible for keeping their account credentials secure.</p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">8. Account Suspension & Deletion</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>Accounts suspended or terminated for abuse, fraud, chargebacks, or Terms violations may have associated data deleted without notice.</p>
              <p>We do not guarantee recovery of deleted accounts or deleted server data.</p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">9. International Users</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>By using our services, you understand that your information may be processed and stored in locations different from your own country.</p>
            </div>
          </div>

          {/* Section 10 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">10. Changes to This Policy</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We may update this Privacy Policy at any time.</p>
              <p>Continued use of our services after updates means you accept the revised policy.</p>
              <p>Users are responsible for reviewing this page periodically.</p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">11. Contact</h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>For privacy concerns, legal requests, or support inquiries:</p>
              <p>
                <span className="text-white font-medium">Email:</span>{" "}
                <a href="mailto:contact@dynexus.space" className="text-[#FFB800] hover:underline">
                  contact@dynexus.space
                </a>
              </p>
              <p>
                <span className="text-white font-medium">Support:</span> Official Dynexus Discord Server
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
