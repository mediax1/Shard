import type { ModerationStatus } from "./serverUtils";

export type PlanKey = "starter" | "standard" | "pro" | "power";
export type Duration = 7 | 30;

export interface PlanSpec {
  name: string;
  ram: number;
  cpu: number;
  storage: number;
  price7: number;
  price30: number;
  disabled?: boolean;
  disabledLabel?: string;
}

export const PLANS: Record<PlanKey, PlanSpec> = {
  starter:  { name: "Starter",  ram: 256,  cpu: 20,  storage: 1024, price7: 20,  price30: 80  },
  standard: { name: "Standard", ram: 1024, cpu: 50,  storage: 2048, price7: 60,  price30: 220 },
  pro:      { name: "Pro",      ram: 2048, cpu: 100, storage: 4096, price7: 110, price30: 400 },
  power:    { name: "Power",    ram: 4096, cpu: 150, storage: 6144, price7: 200, price30: 700, disabled: true, disabledLabel: "Disabled for Now" },
} as const;

export const PLAN_DISPLAY: Record<PlanKey, { ram: string; cpu: string; storage: string }> = {
  starter:  { ram: "256MB", cpu: "20%",  storage: "1GB" },
  standard: { ram: "1GB",   cpu: "50%",  storage: "2GB" },
  pro:      { ram: "2GB",   cpu: "100%", storage: "4GB" },
  power:    { ram: "4GB",   cpu: "150%", storage: "6GB" },
};

export const PLAN_COLORS: Record<PlanKey, string> = {
  starter:  "text-gray-400",
  standard: "text-indigo-400",
  pro:      "text-purple-400",
  power:    "text-red-400",
};

export interface Server {
  id: string;
  pteroId?: number;
  pteroUuid: string;
  name: string;
  language: string;
  plan: PlanKey;
  duration: number;
  cost?: number;
  createdAt: string;
  expiresAt: string;
  status: string;
  moderationStatus?: ModerationStatus;
  moderationReason?: string;
  moderationAt?: string;
  graceEndsAt?: string;
  suspendedAt?: string;
  deletedAt?: string;
}