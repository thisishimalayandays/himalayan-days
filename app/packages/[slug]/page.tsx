import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PackageHero } from '@/components/packages/package-hero';
import { PackageGallery } from '@/components/packages/package-gallery';
import { ItineraryTimeline } from '@/components/packages/itinerary';
import { BookingForm } from '@/components/packages/booking-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Check, X } from 'lucide-react';
import { SimilarPackages } from "@/components/packages/similar-packages";
import { TrustBadges } from '@/components/packages/trust-badges';
import { WinterFAQ } from '@/components/packages/winter-faq';
import { Testimonials } from '@/components/packages/testimonials';
import { MobileBookingBar } from '@/components/packages/mobile-booking-bar';
import { ViewContent } from '@/components/analytics/view-content';
import { RecentActivityToast } from '@/components/packages/recent-activity-toast';

// Spring-specific components
import { SpringPackageHero } from '@/components/packages/spring-package-hero';
import { SpringItinerary } from '@/components/packages/spring-itinerary';
import { SpringFeatureStrip } from '@/components/packages/spring-features';
import { SpringInclusionsExclusions } from '@/components/packages/spring-inclusions';
import { SpringTestimonials } from '@/components/packages/spring-testimonials';
import dynamic from 'next/dynamic';

const SpringVideos = dynamic(() => import('@/components/packages/spring-videos').then(mod => mod.SpringVideos), {
    loading: () => <div className="w-full aspect-video bg-gray-50 animate-pulse rounded-[2rem] max-w-sm mx-auto my-8"></div>
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const pkg = await prisma.package.findUnique({
        where: { slug: resolvedParams.slug }
    });

    if (!pkg) return { title: 'Package Not Found' };

    return {
        title: pkg.title,
        description: pkg.overview.slice(0, 160),
        openGraph: {
            title: pkg.title,
            description: pkg.overview.slice(0, 160),
            images: [pkg.image],
        },
    };
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const pkgRaw = await prisma.package.findUnique({
        where: { slug: resolvedParams.slug }
    });

    if (!pkgRaw) return notFound();

    const pkg = {
        ...pkgRaw,
        gallery: JSON.parse(pkgRaw.gallery) as string[],
        features: JSON.parse(pkgRaw.features) as string[],
        itinerary: JSON.parse(pkgRaw.itinerary) as { day: number; title: string; desc: string }[],
        inclusions: JSON.parse(pkgRaw.inclusions) as string[],
        exclusions: JSON.parse(pkgRaw.exclusions) as string[],
        priceRange: (pkgRaw as any).priceRange as string | null,
    };

    const isWinterWonderland = resolvedParams.slug === 'winter-wonderland-kashmir';
    const isSpringPackage = resolvedParams.slug === 'kashmir-spring-symphony';

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": pkg.title,
        "description": pkg.overview,
        "image": pkg.image,
        "offers": { "@type": "Offer", "priceCurrency": "INR", "price": pkg.startingPrice, "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "128" }
    };

    // ─────────────────────────────────────────────
    // PREMIUM SPRING LAYOUT
    // ─────────────────────────────────────────────
    if (isSpringPackage) {
        return (
            <main className="min-h-screen font-sans bg-[#f9faf8]">
                <div className="bg-black/80"><Header /></div>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

                <SpringPackageHero
                    title={pkg.title}
                    image={pkg.image}
                    duration={pkg.duration}
                    location={pkg.location}
                    price={pkg.startingPrice}
                    priceRange={pkg.priceRange || undefined}
                    rating={pkg.rating || 4.9}
                    reviews={pkg.reviews || 128}
                />

                <div className="container mx-auto px-4 py-14 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* LEFT: Main content */}
                        <div className="lg:col-span-2 space-y-14">

                            {/* Overview */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-7 rounded-full bg-emerald-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">About This Package</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-lg pl-4 border-l-4 border-emerald-100">
                                    {pkg.overview}
                                </p>
                            </section>

                            {/* Feature Highlights */}
                            <section>
                                <SpringFeatureStrip features={pkg.features} />
                            </section>

                            {/* Videos Component */}
                            <SpringVideos />

                            {/* Gallery */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-7 rounded-full bg-emerald-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
                                </div>
                                <PackageGallery images={pkg.gallery} title={pkg.title} />
                            </section>

                            {/* Itinerary */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-7 rounded-full bg-emerald-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h2>
                                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{pkg.itinerary.length} Days</span>
                                </div>
                                <SpringItinerary days={pkg.itinerary} />
                            </section>

                            {/* Inclusions & Exclusions */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-7 rounded-full bg-emerald-500" />
                                    <h2 className="text-2xl font-bold text-gray-900">Inclusions & Exclusions</h2>
                                </div>
                                <SpringInclusionsExclusions
                                    inclusions={pkg.inclusions}
                                    exclusions={pkg.exclusions}
                                />
                            </section>

                            <SpringTestimonials />
                        </div>

                        {/* RIGHT: Booking Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-4">
                                {/* Price summary */}
                                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-5 text-center shadow-lg shadow-emerald-500/25">
                                    <p className="text-emerald-100 text-sm mb-1">Spring 2026 Special Price</p>
                                    <p className="text-4xl font-black">
                                        ₹{pkg.startingPrice.toLocaleString()}
                                        <span className="text-base font-normal text-emerald-200 ml-1">/ person</span>
                                    </p>
                                    {pkg.priceRange && (
                                        <p className="text-emerald-200 text-xs mt-1">
                                            Range: {pkg.priceRange}
                                        </p>
                                    )}
                                    <div className="mt-3 flex justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <span key={s} className="text-amber-400 text-sm">★</span>
                                        ))}
                                        <span className="text-emerald-200 text-xs ml-2">({pkg.reviews || 128} reviews)</span>
                                    </div>
                                </div>

                                <BookingForm packageTitle={pkg.title} isHighDemand={true} />
                            </div>
                        </div>
                    </div>
                </div>

                <SimilarPackages currentId={pkg.id} duration={pkg.duration} />
                <MobileBookingBar price={pkg.startingPrice} />
                <ViewContent id={pkg.id} name={pkg.title} price={pkg.startingPrice} />
                <RecentActivityToast />
                <Footer />
            </main>
        );
    }

    // ─────────────────────────────────────────────
    // STANDARD LAYOUT (all other packages)
    // ─────────────────────────────────────────────
    return (
        <main className="min-h-screen font-sans bg-white">
            <div className="bg-black/80"><Header /></div>

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <PackageHero
                title={pkg.title}
                image={pkg.image}
                duration={pkg.duration}
                location={pkg.location}
                price={pkg.startingPrice}
                priceRange={pkg.priceRange || undefined}
                showEngagement={isWinterWonderland}
                isBestSeller={isWinterWonderland}
            />

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <TrustBadges />

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Overview</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{pkg.overview}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                {pkg.features.map((feature, i) => (
                                    <div key={i} className="bg-orange-50 text-orange-800 px-4 py-2 rounded-lg text-sm font-medium border border-orange-100 text-center">
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <PackageGallery images={pkg.gallery} title={pkg.title} />

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Itinerary</h2>
                            <ItineraryTimeline days={pkg.itinerary} />
                        </section>

                        {pkg.title.toLowerCase().includes('winter') && (
                            <>
                                <Testimonials />
                                <WinterFAQ />
                            </>
                        )}

                        <section className="grid md:grid-cols-2 gap-8 p-8 bg-gray-50 rounded-2xl">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-green-500 rounded-full" /> Inclusions
                                </h3>
                                <ul className="space-y-3">
                                    {pkg.inclusions.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                            <Check className="w-5 h-5 text-green-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-red-500 rounded-full" /> Exclusions
                                </h3>
                                <ul className="space-y-3">
                                    {pkg.exclusions.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                            <X className="w-5 h-5 text-red-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <BookingForm
                            packageTitle={pkg.title}
                            isHighDemand={resolvedParams.slug === 'winter-wonderland-kashmir'}
                        />
                    </div>
                </div>
            </div>

            <SimilarPackages currentId={pkg.id} duration={pkg.duration} />
            <MobileBookingBar price={pkg.startingPrice} />
            <ViewContent id={pkg.id} name={pkg.title} price={pkg.startingPrice} />
            {isWinterWonderland && <RecentActivityToast />}
            <Footer />
        </main>
    );
}
