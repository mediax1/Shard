export type Plan = {
  title: string;
  price: string;
  amount: number;
  baseCredits: number;
  bonusCredits: number;
  totalCredits: number;
  planId: string;
  isPro: boolean;
  perks: string[];
};

export const plans: Plan[] = [
  {
    title: "Starter Pack",
    price: "$1",
    amount: 1,
    baseCredits: 80,
    bonusCredits: 0,
    totalCredits: 80,
    planId: "starter",
    isPro: false,
    perks: ["Standard Node Access", "Standard Support", "Bot Hosting Access"],
  },
  {
    title: "Classic Pack",
    price: "$1.5",
    amount: 1.3,
    baseCredits: 250,
    bonusCredits: 20,
    totalCredits: 270,
    planId: "classic",
    isPro: true,
    perks: ["Priority Node Access", "Faster Deployment", "Standard Support"],
  },
  {
    title: "Boost Pack",
    price: "$5",
    amount: 5,
    baseCredits: 450,
    bonusCredits: 50,
    totalCredits: 500,
    planId: "boost",
    isPro: false,
    perks: ["Priority Node Access", "Faster Deployment", "Priority Support"],
  },
  {
    title: "Mega Pack",
    price: "$10",
    amount: 10,
    baseCredits: 950,
    bonusCredits: 100,
    totalCredits: 1050,
    planId: "mega",
    isPro: false,
    perks: ["Premium Node Access", "Fast Deployment", "Premium Support"],
  },
  {
    title: "Super Pack",
    price: "$20",
    amount: 20,
    baseCredits: 2000,
    bonusCredits: 250,
    totalCredits: 2250,
    planId: "super",
    isPro: false,
    perks: [
      "Premium Node Access",
      "Highest Deployment Priority",
      "Fastest Support Response",
      "VIP Priority Access",
    ],
  },
];