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
import { getPackagesList } from '@/app/actions/packages';
import { getDestinations } from '@/app/actions/destinations';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const packages = await getPackagesList();
  const destinations = await getDestinations();

  return (
    <main className="min-h-screen font-sans">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "Himalayan Days",
            "url": "https://himalayandays.in",
            "logo": "https://himalayandays.in/tourismlogo.png",
            "description": "Your trusted partner for authentic Kashmir experiences.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Srinagar",
              "addressRegion": "Jammu and Kashmir",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-9103901803",
              "contactType": "customer service"
            },
            "sameAs": [
              "https://instagram.com/himalayandays",
              "https://facebook.com/himalayandays"
            ]
          })
        }}
      />
      <Hero />
      <PopularDestinations destinations={destinations} />
      <FeaturedPackages packages={packages} />
      <Intro />
      <WhyChooseUs />
      <StatsSection />
      <Testimonials />
      <FaqSection />
      <WeatherWidget />
      <Footer />
    </main>
  );
}
