import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LogoBar } from "@/components/LogoBar";
import { StatsSection } from "@/components/StatsSection";
import { FeatureCards } from "@/components/FeatureCards";
import { HowItWorksDetail } from "@/components/HowItWorksDetail";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <LogoBar />
      <StatsSection />
      <FeatureCards />
      <HowItWorksDetail />
      <CTASection />
      <Footer />
    </div>
  );
}
