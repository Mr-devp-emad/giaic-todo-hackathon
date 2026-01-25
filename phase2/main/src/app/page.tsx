import {
  Navbar,
  HeroSection,
  FeatureGrid,
  PricingSection,
  Footer,
} from "@/components/landing";

/**
 * TaskFlow Landing Page
 * A premium, high-converting dark-themed landing page
 * featuring glassmorphism, GSAP animations, and modular components
 */
export default function Homepage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />
      <FeatureGrid />
      <PricingSection />
      <Footer />
    </main>
  );
}
