export type BillingCycle = "monthly" | "annual";

export type PlanTier = "free" | "pro" | "studio" | "enterprise";

export interface PricingFeature {
  label: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingPlan {
  id: PlanTier;
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  highlighted?: boolean;
  badge?: string;
  features: PricingFeature[];
  ctaLabel: string;
  ctaHref: string;
}
