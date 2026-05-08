"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";


export default function TOSPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col relative z-10 text-white selection:bg-[#FFB800] selection:text-black">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 md:px-8 py-12 md:py-24">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
            When using our services you agree to our terms of service set out in this article.
            <br />
            Last Updated: 18/06/2023
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
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              1. Definitions
            </h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>
                <span className="text-white font-medium">"Server"/"Servers"</span> refers
                to the service we provide with programs executing within containers
                and the data associated with that container.
              </p>
              <p>
                <span className="text-white font-medium">"We", "Us" and "Our"</span> refer
                to the entity of dynexus bot.space hosting.
              </p>
              <p>
                The terms{" "}
                <span className="text-white font-medium">
                  "User", "Client", "Customer", "Your" and "You"
                </span>{" "}
                refer to you as a visitor of dynexus bot.space hosting.
              </p>
              <p>
                Anything related to{" "}
                <span className="text-white font-medium">"Your Servers"</span> or similar,
                refers to servers which you have access to, including as a sub-user.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              2. Rights We Reserve
            </h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>We reserve certain rights:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#FFB800]">
                <li>To suspend your access to our services at any time as we see fit.</li>
                <li>To modify data associated with your account such as our server billing currency "Credits" as we see fit.</li>
                <li>To erase or suspend access to data associated with your servers including files and databases.</li>
                <li>To process data/files uploaded by you to your servers as is necessary for our legal and safe operation and to provide the best service we can.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              3. Limited Liability
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              dynexus bot.space hosting should not be held liable for incidents such as but
              not limited to hardware failure, fire/water damage and downtime. We
              recommend users to take off-site backups for important data in case
              of an unlikely data loss.
            </p>
          </div>

          {/* Section 4 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              4. Acceptable Use Policy
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light mb-6">
              All users must conform with our acceptable use policy, failure to do
              so may result in your access to our services being revoked/suspended.
              Activities that are considered not acceptable include:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-sm text-gray-300 marker:text-[#FFB800] font-light">
              <li>Illegal activities/knowingly handling illegal content - including activities illegal in the United Kingdom of Great Britain and Northern Ireland and the user's current country they reside in.</li>
              <li>Activities designed to consume computational resources such as cryptocurrency mining or purposefully excessively consuming disk space unnecessarily.</li>
              <li>Attempts to DDoS/cause harm to other individuals or businesses.</li>
              <li>Running scanners that scan the internet, for example checking every IP address for a certain service running.</li>
              <li>Running bruteforce/password guessing attacks off of our services.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              5. Promotions
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              We may run promotional offers, however we do not guarantee that
              promotions will always be usable and we reserve the right to cancel
              any promotional offer at any time or modify its terms.
            </p>
          </div>

          {/* Section 6 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              6. Payments, Refunds, Disputes and Cancellations
            </h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-light">
              <p>
                We offer a 24 hour refund policy, users can contact us within our
                Discord server through our ticket system or via email where
                applicable to request a refund. If 24 hours has passed since a
                payment was made we maintain the right to refuse a refund for any
                reason.
              </p>
              <p>
                We reserve the right to refuse a refund, even within the 24-hour
                refund time, if any form of payment dispute/chargeback has been
                filed. We have a no-tolerance policy towards chargebacks/disputes,
                if there is any issue with our service you should reach out to us
                directly. If a chargeback/dispute is filed on a payment associated
                with your account, we will terminate/suspend your access to our
                services.
              </p>
              <p>
                If we are unable to provide our service, we may refund a payment
                even after 24 hours, although we do not guarantee we will do this
                depending on the circumstances.
              </p>
              <p>
                If a service from us is cancelled by the user, we do not offer
                refunds based on remaining time of the service. For recurring
                payments/subscriptions, upon cancelling a service, users should
                take care to ensure their subscription is cancelled with the
                payment gateway the subscription was processed with.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-2xl hover:border-white/20 transition-colors">
            <h2 className="text-xl font-bold mb-4 text-[#FFB800]">
              7. Account/Service Deletion
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              If you delete your account or a service provided by us, you accept
              that the associated data will be erased, and we do not guarantee we
              will/can recover it. This includes paid services/goods that are
              chosen to be deleted by the user. Users accept that deleting their
              account will delete all associated services/goods.
            </p>
          </div>

        </div>
      </main>


    </div>
  );
}
