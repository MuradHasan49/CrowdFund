import { HeroSlider } from '@/components/home/HeroSlider';
import { TopFundedCampaigns } from '@/components/home/TopFundedCampaigns';
import { Testimonials } from '@/components/home/Testimonials';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ExploreByCategory } from '@/components/home/ExploreByCategory';
import { PlatformStats } from '@/components/home/PlatformStats';
import { Newsletter } from '@/components/home/Newsletter';
import { CallToAction } from '@/components/home/CallToAction';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <PlatformStats />
      <HowItWorks />
      <TopFundedCampaigns />
      <ExploreByCategory />
      <Testimonials />
      <Newsletter />
      <CallToAction />
    </>
  );
}
