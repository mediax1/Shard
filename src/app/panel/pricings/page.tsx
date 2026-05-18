import PricingSection from "@/components/pricing/PricingSection";

export default function PricingsPage() {
  return (
    <div className="relative md:h-full pb-8 md:pb-0">
      <div className="animate-in fade-in zoom-in duration-500">
        <PricingSection />
      </div>
    </div>
  );
}