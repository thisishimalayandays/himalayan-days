import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { WeatherWidget } from '@/components/home/weather-widget';
import { Intro } from '@/components/home/intro';
import { FeaturedPackages } from '@/components/home/featured-packages';
import { StatsSection } from '@/components/home/stats';
import { FaqSection } from '@/components/home/faq';
import { Testimonials } from '@/components/home/testimonials';

import { WhyChooseUs } from '@/components/home/why-choose-us';
import { PopularDestinations } from '@/components/home/popular-destinations';
import { getPackages } from '@/app/actions/packages';
import { getDestinations } from '@/app/actions/destinations';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const packages = await getPackages();
  const destinations = await getDestinations();

  return (
    <main className="min-h-screen font-sans">
      <Header />
      <Hero />
      <Intro />
      <WhyChooseUs />
      <PopularDestinations destinations={destinations} />
      <FeaturedPackages packages={packages} />
      <StatsSection />
      <Testimonials />
      <FaqSection />
      <WeatherWidget />
      <Footer />
    </main>
  );
}
