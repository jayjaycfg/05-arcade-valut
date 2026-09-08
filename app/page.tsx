import { ActivitySection } from "@/components/home/ActivitySection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { FinalCta } from "@/components/home/FinalCta";
import { GamesRail } from "@/components/home/GamesRail";
import { HeroSection } from "@/components/home/HeroSection";
import { PricingSection } from "@/components/home/PricingSection";
import { Reveal } from "@/components/home/Reveal";
import { StatsBand } from "@/components/home/StatsBand";
import { getHomeData, topPlayersToday } from "@/lib/home";

export const revalidate = 300;

export default async function Home() {
  const { featuredGames, stats, recentActivity } = await getHomeData();

  return (
    <div className="home fade-in">
      <HeroSection />

      <Reveal>
        <FeatureGrid />
      </Reveal>

      <Reveal>
        <GamesRail games={featuredGames} />
      </Reveal>

      <Reveal>
        <StatsBand stats={stats} />
      </Reveal>

      <Reveal>
        <ActivitySection recentActivity={recentActivity} topPlayersToday={topPlayersToday} />
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
