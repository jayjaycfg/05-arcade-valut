import { ActivitySection } from "@/components/home/ActivitySection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { FinalCta } from "@/components/home/FinalCta";
import { GamesRail } from "@/components/home/GamesRail";
import { HeroSection } from "@/components/home/HeroSection";
import { PricingSection } from "@/components/home/PricingSection";
import { Reveal } from "@/components/home/Reveal";
import { StatsBand } from "@/components/home/StatsBand";

export default function Home() {
  return (
    <div className="home fade-in">
      <HeroSection />

      <Reveal>
        <FeatureGrid />
      </Reveal>

      <Reveal>
        <GamesRail />
      </Reveal>

      <Reveal>
        <StatsBand />
      </Reveal>

      <Reveal>
        <ActivitySection />
      </Reveal>

      <Reveal>
        <PricingSection />
      </Reveal>

      <Reveal>
        <FinalCta />
      </Reveal>
    </div>
  );
}
