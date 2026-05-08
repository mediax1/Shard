"use client";

import React from 'react';
import { Check, X } from 'lucide-react';

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  isPro?: boolean;
  amount: number;    // credits
  priceUsd: number;  // actual USD price sent to Razorpay
  planId: string;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPro = false,
  amount,
  priceUsd,
  planId,
}: PricingCardProps) => {
  const handlePurchase = async () => {
    const res = await fetch('/api/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: priceUsd, planId }),
    });

    const data = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: 'Shard',
      description: `${title} - ${description}`,
      order_id: data.id,
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        const verify = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...response, planId }),
        });

        const result = await verify.json();

        if (result.success) {
          if (result.tierUpgraded) {
            alert('Payment successful! Credits added and your account has been upgraded to Paid tier 🎉');
          } else {
            alert('Payment successful! Credits added to your account.');
          }
        } else {
          alert('Payment verification failed. Contact support.');
        }
      },
      theme: {
        color: '#FFB800',
      },
    };

    if (typeof (window as any).Razorpay === 'undefined') {
      alert('Payment gateway is still loading. Please try again in a moment.');
      return;
    }

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div
      className={`relative flex flex-col p-4 md:p-3 lg:p-5 rounded-[20px] md:rounded-[16px] lg:rounded-[24px] transition-all duration-500 backdrop-blur-2xl border border-white/10
        ${isPro ? 'bg-black/60 border-[#FFB800]/50 shadow-[0_0_30px_-10px_rgba(255,184,0,0.4)] md:scale-105 z-30' : 'bg-white/5 hover:bg-white/10'}
        w-full h-full z-20`}
    >
      <div className="mb-3 md:mb-2 lg:mb-4 text-center">
        <p className="text-white text-base md:text-sm lg:text-lg font-bold mb-0.5">{title}</p>
        <p className="text-[#FFB800] text-xs md:text-[10px] lg:text-xs font-semibold mb-2 md:mb-1 lg:mb-2 h-4 md:h-3 lg:h-4">{description}</p>
        <h3 className="text-white text-3xl md:text-2xl lg:text-4xl font-black tracking-tight mb-1">
          {price}
        </h3>
      </div>

      <div className="flex-grow space-y-2 md:space-y-1.5 lg:space-y-2 mb-3 md:mb-2 lg:mb-4">
        {features.map((feature: PricingFeature, index: number) => (
          <div key={index} className={`flex items-center gap-2 ${feature.included ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`mt-0.5 flex-shrink-0 w-4 h-4 md:w-3.5 md:h-3.5 rounded-full flex items-center justify-center border ${feature.included ? 'bg-[#FFB800]/20 border-[#FFB800]/50' : 'bg-white/5 border-white/10'}`}>
              {feature.included ? (
                <Check className="w-2.5 h-2.5 md:w-2 md:h-2 text-[#FFB800]" strokeWidth={3} />
              ) : (
                <X className="w-2.5 h-2.5 md:w-2 md:h-2 text-white" strokeWidth={3} />
              )}
            </div>
            <span className={`text-[13px] md:text-[11px] lg:text-[13px] ${feature.included ? 'text-white/90' : 'text-white/50 line-through'}`}>{feature.name}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handlePurchase}
        className={`w-full py-2 md:py-1.5 lg:py-2.5 mt-auto rounded-full font-bold text-sm md:text-xs lg:text-sm transition-all active:scale-[0.98] ${isPro ? 'bg-[#FFB800] text-black hover:bg-[#E5A500] shadow-[0_0_15px_rgba(255,184,0,0.3)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
      >
        Purchase
      </button>

      {isPro && (
        <div className="absolute inset-0 rounded-[20px] md:rounded-[16px] lg:rounded-[24px] pointer-events-none ring-1 ring-[#FFB800]/40 blur-[1px]"></div>
      )}
    </div>
  );
};

export default function PricingSection() {
  const plans = [
    {
      title: "Starter Pack",
      price: "$1",
      description: "100 coins",
      amount: 100,
      priceUsd: 1,
      planId: "starter",
      features: [
        { name: "Host Your Discord Bots", included: true },
        { name: "Premium Support", included: false },
        { name: "Premium Node", included: false }
      ]
    },
    {
      title: "Classic Pack",
      price: "$3",
      description: "300 coins (+50 bonus)",
      amount: 300,
      priceUsd: 3,
      planId: "classic",
      isPro: true,
      features: [
        { name: "Host Your Discord Bots", included: true },
        { name: "Premium Support", included: true },
        { name: "Premium Node", included: false }
      ]
    },
    {
      title: "Boost Pack",
      price: "$5",
      description: "500 coins (+100 bonus)",
      amount: 500,
      priceUsd: 5,
      planId: "boost",
      features: [
        { name: "Host Your Discord Bots", included: true },
        { name: "Premium Support", included: true },
        { name: "Premium Node", included: true }
      ]
    },
    {
      title: "Mega Pack",
      price: "$10",
      description: "1000 coins (+200 bonus)",
      amount: 1000,
      priceUsd: 10,
      planId: "mega",
      features: [
        { name: "Host Your Discord Bots", included: true },
        { name: "Premium Support", included: true },
        { name: "Premium Node", included: true }
      ]
    },
    {
      title: "Super Pack",
      price: "$20",
      description: "2000 coins (+400 bonus)",
      amount: 2000,
      priceUsd: 20,
      planId: "super",
      features: [
        { name: "Host Your Discord Bots", included: true },
        { name: "Premium Support", included: true },
        { name: "Premium Node", included: true }
      ]
    }
  ];

  return (
    <div className="w-full md:h-full bg-[#050505] text-white selection:bg-[#FFB800]/30 font-sans relative rounded-2xl md:rounded-3xl overflow-visible md:overflow-hidden border border-white/5 flex flex-col pb-6 md:pb-0">
      <div
        className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute bottom-[-10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#FFB800]/20 blur-[130px] mix-blend-screen"></div>
        <div className="absolute top-[0%] right-[0%] w-[40vw] h-[40vw] rounded-full bg-[#FFB800]/15 blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-gradient-to-t from-[#FFB800]/10 to-transparent rounded-[100%] blur-[100px]"></div>
      </div>

      <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none z-0 select-none overflow-hidden h-full">
        <div className="relative w-full max-w-7xl h-full flex justify-center">
          <h1 className="text-[15vw] lg:text-[180px] font-bold tracking-tighter leading-none text-center
            bg-gradient-to-b from-white/10 via-white/5 to-transparent bg-clip-text text-transparent mt-4">
            Pricing
          </h1>
        </div>
      </div>

      <div className="relative z-20 w-full mx-auto px-3 md:px-4 py-4 md:py-4 lg:py-6 flex-1 flex flex-col justify-center items-center">
        <div className="text-center mb-4 md:mb-4 lg:mb-6 shrink-0">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight
            bg-gradient-to-r from-[#FFB800] to-[#FFE082] bg-clip-text text-transparent drop-shadow-2xl mb-1">
            Store
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-xl mx-auto">
            Purchase coins to deploy premium servers and access top-tier features.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-3 lg:gap-4 items-stretch justify-items-center w-full max-w-7xl">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFB800]/30 to-transparent z-20"></div>
    </div>
  );
}