import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCardsSection } from "@/components/home/FeatureCardsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { AIPipelineSection } from "@/components/home/AIPipelineSection";
import { SupportedFormatsSection } from "@/components/home/SupportedFormatsSection";
import { PricingPreviewSection } from "@/components/home/PricingPreviewSection";
import { RoadmapPreviewSection } from "@/components/home/RoadmapPreviewSection";
import { FAQPreviewSection } from "@/components/home/FAQPreviewSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "PurePic — AI-Powered Photography Intelligence",
  description:
    "The AI platform that understands photographs before editing them. Intelligent culling, aesthetic analysis, semantic editing, and batch processing for professional photographers.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCardsSection />
      <HowItWorksSection />
      <AIPipelineSection />
      <SupportedFormatsSection />
      <PricingPreviewSection />
      <RoadmapPreviewSection />
      <FAQPreviewSection />
      <NewsletterSection />
    </>
  );
}
